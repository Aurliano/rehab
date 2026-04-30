using System.ComponentModel.DataAnnotations;

namespace RehabAPI.Models;

public class SessionMetric
{
    public int Id { get; set; }

    [Required]
    public int SessionId { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "مسافت باید مثبت باشد")]
    public double DistanceTraveled { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "مدت زمان باید مثبت باشد")]
    public int Duration { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "سرعت باید مثبت باشد")]
    public double AverageSpeed { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "امتیاز باید مثبت باشد")]
    public int Score { get; set; }

    // متریک‌های اختیاری برای آینده
    public double? RangeOfMotion { get; set; }
    public double? ReactionTime { get; set; }
    public double? Accuracy { get; set; }
    public int? RepetitionCount { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Session Session { get; set; } = null!;
}
