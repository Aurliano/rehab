using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RehabAPI.Data;
using RehabAPI.Models;

namespace RehabAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly RehabDbContext _context;

    public PatientsController(RehabDbContext context)
    {
        _context = context;
    }

    // GET: api/patients
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
    {
        return await _context.Patients
            .Include(p => p.Sessions)
            .ToListAsync();
    }

    // GET: api/patients/with-next-session
    [HttpGet("with-next-session")]
    public async Task<ActionResult<IEnumerable<PatientWithNextSessionDto>>> GetPatientsWithNextSession()
    {
        var now = DateTime.UtcNow;

        var patients = await _context.Patients
            .Include(p => p.Sessions)
            .Select(p => new PatientWithNextSessionDto
            {
                PatientId = p.Id,  // ✅ خط 38 - تغییر از Id به PatientId
                FirstName = p.FirstName,
                LastName = p.LastName,
                NationalCode = p.NationalCode,
                DateOfBirth = p.DateOfBirth,
                Gender = p.Gender,
                PhoneNumber = p.PhoneNumber,
                InjuryType = p.InjuryType,
                AffectedSide = p.AffectedSide,
                InjuryDate = p.InjuryDate,

                NextSession = p.Sessions
                    .Where(s => s.Status == SessionStatus.Scheduled && s.ScheduledTime > now)
                    .OrderBy(s => s.ScheduledTime)
                    .Select(s => new SessionDto
                    {
                        SessionId = s.Id,   // ✅ خط 54 - قبلاً Id بود
                        PatientId = s.PatientId,
                        PatientName = p.FirstName + " " + p.LastName,
                        ScheduledTime = s.ScheduledTime,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime,
                        Difficulty = s.Difficulty,
                        Status = s.Status
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(patients);
    }

    // GET: api/patients/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.Sessions)
            .ThenInclude(s => s.Metrics)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (patient == null)
            return NotFound(new { message = "بیمار یافت نشد" });

        return patient;
    }

    // POST: api/patients
    [HttpPost]
    public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
    }

    // PUT: api/patients/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, Patient patient)
    {
        if (id != patient.Id)
            return BadRequest(new { message = "شناسه بیمار مطابقت ندارد" });

        _context.Entry(patient).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Patients.AnyAsync(p => p.Id == id))
                return NotFound(new { message = "بیمار یافت نشد" });

            throw;
        }

        return NoContent();
    }

    // DELETE: api/patients/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patients.FindAsync(id);

        if (patient == null)
            return NotFound(new { message = "بیمار یافت نشد" });

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
