namespace RehabAPI.Models;

public class SessionMetric
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public float? RangeOfMotion { get; set; }
    public float? ReactionTime { get; set; }
    public float? Accuracy { get; set; }
    public int? RepetitionCount { get; set; }
    public int? Score { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Session Session { get; set; } = null!;
}
