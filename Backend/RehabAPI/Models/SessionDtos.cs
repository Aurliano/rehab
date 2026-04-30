namespace RehabAPI.Models;

public class StartSessionRequest
{
    public int PatientId { get; set; }
    public string GameType { get; set; }
    public int DifficultyLevel { get; set; }
}

public class AddMetricRequest
{
    public double RangeOfMotion { get; set; }
    public double ReactionTime { get; set; }
    public double Accuracy { get; set; }
    public int RepetitionCount { get; set; }
    public int Score { get; set; }
}

public class SessionReport
{
    public int SessionId { get; set; }
    public string PatientName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int TotalMetrics { get; set; }
    public double AverageAccuracy { get; set; }
    public double AverageReactionTime { get; set; }
    public int TotalRepetitions { get; set; }
    public int TotalScore { get; set; }
}
public class PatientWithNextSession
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string NationalCode { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string? Phone { get; set; }
    public string InjuryType { get; set; }
    public string AffectedSide { get; set; }
    public string? Notes { get; set; }
    public Session? NextSession { get; set; }
}
public class CreateSessionRequest
{
    public int PatientId { get; set; }
    public DateTime ScheduledTime { get; set; }
}

public class UpdateSessionRequest
{
    public DateTime ScheduledTime { get; set; }
    public string Status { get; set; }
}
