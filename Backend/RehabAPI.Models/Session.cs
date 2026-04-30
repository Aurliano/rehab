using System.ComponentModel.DataAnnotations;

namespace RehabAPI.Models;

public class Session
{
    public int Id { get; set; }

    [Required]
    public int PatientId { get; set; }

    [Required(ErrorMessage = "زمان برنامه‌ریزی‌شده الزامی است")]
    public DateTime ScheduledTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    [Required]
    public GameDifficulty Difficulty { get; set; }

    [Required]
    public SessionStatus Status { get; set; } = SessionStatus.Scheduled;

    // Navigation properties
    public Patient Patient { get; set; } = null!;
    public ICollection<SessionMetric> Metrics { get; set; } = new List<SessionMetric>();
}
