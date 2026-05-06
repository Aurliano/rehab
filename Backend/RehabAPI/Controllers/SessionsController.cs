using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RehabAPI.Data;
using RehabAPI.Models;

namespace RehabAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly RehabDbContext _context;

    public SessionsController(RehabDbContext context)
    {
        _context = context;
    }

    // GET: api/sessions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SessionDto>>> GetSessions()
    {
        var sessions = await _context.Sessions
            .Include(s => s.Patient)
            .Select(s => new SessionDto
            {
                SessionId = s.Id,  // ✅ تغییر از Id به SessionId
                PatientId = s.PatientId,
                PatientName = s.Patient.FirstName + " " + s.Patient.LastName,
                GameType = "",  // ✅ اگر در مدل Session فیلد GameType نداری، خالی بذار
                ScheduledTime = s.ScheduledTime,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Difficulty = s.Difficulty,
                Status = s.Status
            })
            .ToListAsync();

        return Ok(sessions);
    }

    // GET: api/sessions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<SessionDto>> GetSession(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Patient)
            .FirstOrDefaultAsync(s => s.Id == id);
        
        if (session == null)
            return NotFound($"Session {id} not found");
        
        var dto = new SessionDto
        {
            SessionId = session.Id,  // ✅ تغییر از
            PatientId = session.PatientId,
            PatientName = $"{session.Patient.FirstName} {session.Patient.LastName}", // ✅ اصلاح متغیر patient
            GameType = "",
            ScheduledTime = session.ScheduledTime,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Difficulty = session.Difficulty,
            Status = session.Status
        };
    
        return Ok(dto);
    }

    // POST: api/sessions
    [HttpPost]
    public async Task<ActionResult<SessionDto>> CreateSession(CreateSessionRequest request)
    {
        var patient = await _context.Patients.FindAsync(request.PatientId);
        if (patient == null)
            return NotFound($"Patient with ID {request.PatientId} not found");

        var session = new Session
        {
            PatientId = request.PatientId,
            ScheduledTime = request.ScheduledTime,
            Difficulty = request.Difficulty,
            Status = SessionStatus.Scheduled
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSession), new { id = session.Id }, new SessionDto
        {
            SessionId = session.Id, // ✅ اصلاح
            PatientId = session.PatientId,
            PatientName = $"{patient.FirstName} {patient.LastName}",
            GameType = "",
            ScheduledTime = session.ScheduledTime,
            Difficulty = session.Difficulty,
            Status = session.Status
        });
    }

    // PUT: api/sessions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSession(int id, UpdateSessionRequest request)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        // ✅ چون ScheduledTime و Difficulty را از DTO حذف کردیم،
        // دیگر این دو خط نباید وجود داشته باشند

        if (request.Status.HasValue)
            session.Status = request.Status.Value;

        if (request.StartTime.HasValue)
            session.StartTime = request.StartTime;

        if (request.EndTime.HasValue)
            session.EndTime = request.EndTime;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // POST: api/sessions/{id}/metrics
    [HttpPost("{id}/metrics")]
    public async Task<IActionResult> AddMetric(int id, AddMetricRequest request)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (session.Status != SessionStatus.InProgress)
            return BadRequest(new { message = "جلسه فعال نیست" });

        var metric = new SessionMetric
        {
            SessionId = id,
            DistanceTraveled = request.DistanceTraveled,
            Duration = request.Duration,
            AverageSpeed = request.AverageSpeed,
            Timestamp = DateTime.UtcNow

            // ✅ حذف Score, RangeOfMotion, ReactionTime, Accuracy, RepetitionCount
        };

        _context.SessionMetrics.Add(metric);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // GET: api/sessions/{id}/report
    [HttpGet("{id}/report")]
    public async Task<ActionResult<SessionReport>> GetReport(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Patient)
            .Include(s => s.Metrics)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        var metrics = session.Metrics;

        var report = new SessionReport
        {
            SessionId = session.Id,
            PatientName = session.Patient.FirstName + " " + session.Patient.LastName,
            ScheduledTime = session.ScheduledTime,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            TotalMetrics = metrics.Count,
            TotalDistance = metrics.Sum(m => m.DistanceTraveled),
            TotalDuration = metrics.Sum(m => m.Duration),
            AverageSpeed = metrics.Any() ? metrics.Average(m => m.AverageSpeed) : 0

            // ✅ حذف Difficulty
            // ✅ حذف Status
            // ✅ حذف TotalScore
            // ✅ حذف Accuracy / ROM / ReactionTime / Repetitions
        };

        return Ok(report);
    }
}
