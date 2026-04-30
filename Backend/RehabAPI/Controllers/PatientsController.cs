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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
    {
        return await _context.Patients.Include(p => p.Sessions).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.Sessions)
            .ThenInclude(s => s.Metrics)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (patient == null) return NotFound();
        return patient;
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, Patient patient)
    {
        if (id != patient.Id) return BadRequest();

        _context.Entry(patient).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return NotFound();

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    // PatientsController.cs

[HttpGet("with-next-session")]
public async Task<ActionResult<IEnumerable<PatientWithNextSession>>> GetPatientsWithNextSession()
{
    var patients = await _context.Patients
        .Include(p => p.Sessions)
        .ToListAsync();

    var now = DateTime.UtcNow;

    var result = patients.Select(p => new PatientWithNextSession
    {
        Id = p.Id,
        FirstName = p.FirstName,
        LastName = p.LastName,
        NationalCode = p.NationalCode,
        Age = p.Age,
        Gender = p.Gender,
        Phone = p.Phone,
        InjuryType = p.InjuryType,
        AffectedSide = p.AffectedSide,
        Notes = p.Notes,
        NextSession = p.Sessions
            .Where(s => s.ScheduledTime > now && s.Status == "scheduled")
            .OrderBy(s => s.ScheduledTime)
            .FirstOrDefault()
    }).ToList();

    return Ok(result);
}


}
