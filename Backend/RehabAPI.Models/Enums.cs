namespace RehabAPI.Models;

public enum Gender
{
    Male,
    Female,
    Other
}

public enum InjuryType
{
    Stroke,
    SpinalCordInjury,
    TraumaticBrainInjury,
    Orthopedic,
    Neurological,
    Other
}

public enum AffectedSide
{
    Left,
    Right,
    Both
}

// ✅ تغییر نام از GameDifficulty به DifficultyLevel
public enum DifficultyLevel
{
    Easy,
    Normal,
    Hard
}

public enum SessionStatus
{
    Scheduled,
    InProgress,
    Completed,
    Cancelled
}
