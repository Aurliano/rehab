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
                Id = s.Id,
                PatientId = s.PatientId,
                PatientName = s.Patient.FirstName + " " + s.Patient.LastName,
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
            .Where(s => s.Id == id)
            .Select(s => new SessionDto
            {
                Id = s.Id,
                PatientId = s.PatientId,
                PatientName = s.Patient.FirstName + " " + s.Patient.LastName,
                ScheduledTime = s.ScheduledTime,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Difficulty = s.Difficulty,
                Status = s.Status
            })
            .FirstOrDefaultAsync();

        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        return Ok(session);
    }

    // POST: api/sessions
    [HttpPost]
    public async Task<ActionResult<SessionDto>> CreateSession(CreateSessionRequest request)
    {
        // بررسی وجود بیمار
        var patient = await _context.Patients.FindAsync(request.PatientId);
        if (patient == null)
            return NotFound(new { message = "بیمار یافت نشد" });

        var session = new Session
        {
            PatientId = request.PatientId,
            ScheduledTime = request.ScheduledTime,
            Difficulty = request.Difficulty,
            Status = SessionStatus.Scheduled
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        var dto = new SessionDto
        {
            Id = session.Id,
            PatientId = session.PatientId,
            PatientName = patient.FirstName + " " + patient.LastName,
            ScheduledTime = session.ScheduledTime,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Difficulty = session.Difficulty,
            Status = session.Status
        };

        return CreatedAtAction(nameof(GetSession), new { id = session.Id }, dto);
    }

    // PUT: api/sessions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSession(int id, UpdateSessionRequest request)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (request.ScheduledTime.HasValue)
            session.ScheduledTime = request.ScheduledTime.Value;

        if (request.Difficulty.HasValue)
            session.Difficulty = request.Difficulty.Value;

        if (request.Status.HasValue)
            session.Status = request.Status.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/sessions/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/sessions/{id}/start
    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartSession(int id)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (session.Status != SessionStatus.Scheduled)
            return BadRequest(new { message = "جلسه قابل شروع نیست" });

        session.StartTime = DateTime.UtcNow;
        session.Status = SessionStatus.InProgress;

        await _context.SaveChangesAsync();
        return Ok();
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
            Score = request.Score,
            RangeOfMotion = request.RangeOfMotion,
            ReactionTime = request.ReactionTime,
            Accuracy = request.Accuracy,
            RepetitionCount = request.RepetitionCount,
            Timestamp = DateTime.UtcNow
        };

        _context.SessionMetrics.Add(metric);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // POST: api/sessions/{id}/end
    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndSession(int id)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (session.Status != SessionStatus.InProgress)
            return BadRequest(new { message = "جلسه فعال نیست" });

        session.EndTime = DateTime.UtcNow;
        session.Status = SessionStatus.Completed;

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
            Difficulty = session.Difficulty,
            Status = session.Status,
            TotalMetrics = metrics.Count,
            TotalDistance = metrics.Sum(m => m.DistanceTraveled),
            TotalDuration = metrics.Sum(m => m.Duration),
            AverageSpeed = metrics.Any() ? metrics.Average(m => m.AverageSpeed) : 0,
            TotalScore = metrics.Sum(m => m.Score),
            AverageRangeOfMotion = metrics.Any(m => m.RangeOfMotion.HasValue)
                ? metrics.Where(m => m.RangeOfMotion.HasValue).Average(m => m.RangeOfMotion.Value)
                : null,
            AverageReactionTime = metrics.Any(m => m.ReactionTime.HasValue)
                ? metrics.Where(m => m.ReactionTime.HasValue).Average(m => m.ReactionTime.Value)
                : null,
            AverageAccuracy = metrics.Any(m => m.Accuracy.HasValue)
                ? metrics.Where(m => m.Accuracy.HasValue).Average(m => m.Accuracy.Value)
                : null,
            TotalRepetitions = metrics.Any(m => m.RepetitionCount.HasValue)
                ? metrics.Where(m => m.RepetitionCount.HasValue).Sum(m => m.RepetitionCount.Value)
                : null
        };

        return Ok(report);
    }
}
