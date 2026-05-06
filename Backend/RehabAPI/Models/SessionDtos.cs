namespace RehabAPI.Models;

// برای CRUD عمومی
public class CreateSessionRequest
{
    public int PatientId { get; set; }
    public string GameType { get; set; } = string.Empty;
    public DifficultyLevel Difficulty { get; set; }
    public DateTime ScheduledTime { get; set; }
}

public class UpdateSessionRequest
{
    public SessionStatus? Status { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
}

public class SessionDto
{
    public int SessionId { get; set; }  // ✅ نه Id
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string GameType { get; set; } = string.Empty;
    public DifficultyLevel Difficulty { get; set; }
    public SessionStatus Status { get; set; }
    public DateTime ScheduledTime { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
}

public class PatientWithNextSessionDto
{
    public int PatientId { get; set; }  // ✅ نه Id
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public InjuryType InjuryType { get; set; }
    public AffectedSide AffectedSide { get; set; }
    public DateTime InjuryDate { get; set; }
    
    // جلسه بعدی (اگر وجود داشته باشد)
    public SessionDto? NextSession { get; set; }
}

// برای Real-time tracking
public class StartSessionRequest
{
    public int PatientId { get; set; }
    public string GameType { get; set; } = string.Empty;
    public DifficultyLevel Difficulty { get; set; }
}

public class AddMetricRequest
{
    public double DistanceTraveled { get; set; }
    public int Duration { get; set; }
    public double AverageSpeed { get; set; }
    public DateTime Timestamp { get; set; }
}

public class SessionReport
{
    public int SessionId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScheduledTime { get; set; }
     public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int TotalMetrics { get; set; }
    
    // Real-time metrics
    public double TotalDistance { get; set; }
    public double TotalDuration { get; set; }
    public double AverageSpeed { get; set; }
    
    // Optional detailed metrics
    public double? AverageRangeOfMotion { get; set; }
    public double? AverageReactionTime { get; set; }
    public double? AverageAccuracy { get; set; }
    public int? TotalRepetitions { get; set; }
}
