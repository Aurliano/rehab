public class CreateSessionRequest
{
    [Required]
    public int PatientId { get; set; }
    
    [Required]
    public DateTime ScheduledTime { get; set; }
    
    [Required]
    public GameDifficulty Difficulty { get; set; }
}

public class UpdateSessionRequest
{
    public DateTime? ScheduledTime { get; set; }
    public GameDifficulty? Difficulty { get; set; }
    public SessionStatus? Status { get; set; }
}

public class SessionDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScheduledTime { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public GameDifficulty Difficulty { get; set; }
    public SessionStatus Status { get; set; }
}
