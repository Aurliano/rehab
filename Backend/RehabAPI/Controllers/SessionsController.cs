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
    public async Task<ActionResult<IEnumerable<Session>>> GetSessions()
    {
        return await _context.Sessions
            .Include(s => s.Patient)
            .Include(s => s.Metrics)
            .ToListAsync();
    }

    // GET: api/sessions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Session>> GetSession(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Patient)
            .Include(s => s.Metrics)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound();

        return session;
    }

    // POST: api/sessions/start
    [HttpPost("start")]
    public async Task<ActionResult<Session>> StartSession([FromBody] StartSessionRequest request)
    {
        var patient = await _context.Patients.FindAsync(request.PatientId);
        if (patient == null)
            return NotFound(new { message = "بیمار یافت نشد" });

        var session = new Session
        {
            PatientId = request.PatientId,
            StartTime = DateTime.UtcNow,
            DifficultyLevel = request.DifficultyLevel,
            GameType = request.GameType,
            Status = "Active"
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSession), new { id = session.Id }, session);
    }

    // POST: api/sessions/5/metrics
    [HttpPost("{id}/metrics")]
    public async Task<ActionResult<SessionMetric>> AddMetric(int id, [FromBody] AddMetricRequest request)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (session.Status != "Active")
            return BadRequest(new { message = "جلسه فعال نیست" });

        var metric = new SessionMetric
        {
            SessionId = id,
            RangeOfMotion = request.RangeOfMotion,
            ReactionTime = request.ReactionTime,
            Accuracy = request.Accuracy,
            RepetitionCount = request.RepetitionCount,
            Score = request.Score,
            RecordedAt = DateTime.UtcNow
        };

        _context.SessionMetrics.Add(metric);
        await _context.SaveChangesAsync();

        return Ok(metric);
    }

    // POST: api/sessions/5/end
    [HttpPost("{id}/end")]
    public async Task<ActionResult<Session>> EndSession(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Metrics)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        if (session.Status != "Active")
            return BadRequest(new { message = "جلسه قبلاً پایان یافته است" });

        session.EndTime = DateTime.UtcNow;
        session.Status = "Completed";

        await _context.SaveChangesAsync();

        return Ok(session);
    }

    // GET: api/sessions/5/report
    [HttpGet("{id}/report")]
    public async Task<ActionResult<SessionReport>> GetSessionReport(int id)
    {
        var session = await _context.Sessions
            .Include(s => s.Patient)
            .Include(s => s.Metrics)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound(new { message = "جلسه یافت نشد" });

        var report = new SessionReport
        {
            SessionId = session.Id,
            PatientName = $"{session.Patient.FirstName} {session.Patient.LastName}",
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            TotalMetrics = session.Metrics.Count,
            AverageAccuracy = session.Metrics.Any() ? session.Metrics.Average(m => m.Accuracy) : 0,
            AverageReactionTime = session.Metrics.Any() ? session.Metrics.Average(m => m.ReactionTime) : 0,
            TotalRepetitions = session.Metrics.Sum(m => m.RepetitionCount),
            TotalScore = session.Metrics.Sum(m => m.Score)
        };

        return Ok(report);
    }
    [HttpPost]
    public async Task<ActionResult<Session>> CreateSession(CreateSessionRequest request)
    {   
        var session = new Session
        {
            PatientId = request.PatientId,
            ScheduledTime = request.ScheduledTime,
            Status = "scheduled"
        };
    
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();
    
        return CreatedAtAction(nameof(GetSession), new { id = session.Id }, session);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSession(int id, UpdateSessionRequest request)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null) return NotFound();
    
        session.ScheduledTime = request.ScheduledTime;
        session.Status = request.Status;
    
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        var session = await _context.Sessions.FindAsync(id);
        if (session == null) return NotFound();
    
        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync();
    
        return NoContent();
    }


}
