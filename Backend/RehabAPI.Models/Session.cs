namespace RehabAPI.Models;

public class Session
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime? EndTime { get; set; }
    public int? DifficultyLevel { get; set; }
    public string? GameType { get; set; }
    public string Status { get; set; } = "Active"; // "Active", "Completed", "Cancelled"
    
    // Navigation
    public Patient Patient { get; set; } = null!;
    public ICollection<SessionMetric> Metrics { get; set; } = new List<SessionMetric>();
}
