namespace RehabAPI.Models;

public class Patient
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty; // "Male" or "Female"
    public string? Phone { get; set; }
    public string? InjuryType { get; set; }
    public string? AffectedSide { get; set; } // "Left", "Right", "Both"
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}
