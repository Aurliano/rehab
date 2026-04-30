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

public enum GameDifficulty
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
