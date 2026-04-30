using System.ComponentModel.DataAnnotations;

namespace RehabAPI.Models;

/// <summary>
/// درخواست ایجاد جلسه جدید (زمان‌بندی‌شده)
/// </summary>
public class CreateSessionRequest
{
    [Required(ErrorMessage = "شناسه بیمار الزامی است")]
    public int PatientId { get; set; }

    [Required(ErrorMessage = "زمان برنامه‌ریزی‌شده الزامی است")]
    public DateTime ScheduledTime { get; set; }

    [Required(ErrorMessage = "سطح دشواری الزامی است")]
    public GameDifficulty Difficulty { get; set; }
}

/// <summary>
/// درخواست به‌روزرسانی جلسه موجود
/// </summary>
public class UpdateSessionRequest
{
    public DateTime? ScheduledTime { get; set; }
    public GameDifficulty? Difficulty { get; set; }
    public SessionStatus? Status { get; set; }
}

/// <summary>
/// DTO نمایش جلسه (برای لیست و جزئیات)
/// </summary>
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

/// <summary>
/// DTO بیمار همراه با جلسه بعدی
/// </summary>
public class PatientWithNextSessionDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public InjuryType InjuryType { get; set; }
    public AffectedSide AffectedSide { get; set; }
    public DateTime InjuryDate { get; set; }
    
    /// <summary>
    /// نزدیک‌ترین جلسه برنامه‌ریزی‌شده در آینده
    /// </summary>
    public SessionDto? NextSession { get; set; }
}

/// <summary>
/// درخواست ثبت متریک جدید برای جلسه در حال اجرا
/// </summary>
public class AddMetricRequest
{
    [Required(ErrorMessage = "مسافت طی‌شده الزامی است")]
    [Range(0, double.MaxValue, ErrorMessage = "مسافت باید مثبت باشد")]
    public double DistanceTraveled { get; set; }

    [Required(ErrorMessage = "مدت زمان الزامی است")]
    [Range(0, int.MaxValue, ErrorMessage = "مدت زمان باید مثبت باشد")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "سرعت متوسط الزامی است")]
    [Range(0, double.MaxValue, ErrorMessage = "سرعت باید مثبت باشد")]
    public double AverageSpeed { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "امتیاز باید مثبت باشد")]
    public int Score { get; set; }

    // متریک‌های اختیاری برای آینده
    public double? RangeOfMotion { get; set; }
    public double? ReactionTime { get; set; }
    public double? Accuracy { get; set; }
    public int? RepetitionCount { get; set; }
}

/// <summary>
/// گزارش کامل جلسه
/// </summary>
public class SessionReport
{
    public int SessionId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScheduledTime { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public GameDifficulty Difficulty { get; set; }
    public SessionStatus Status { get; set; }
    
    // آمار متریک‌ها
    public int TotalMetrics { get; set; }
    public double TotalDistance { get; set; }
    public int TotalDuration { get; set; }
    public double AverageSpeed { get; set; }
    public int TotalScore { get; set; }
    
    // متریک‌های اختیاری
    public double? AverageRangeOfMotion { get; set; }
    public double? AverageReactionTime { get; set; }
    public double? AverageAccuracy { get; set; }
    public int? TotalRepetitions { get; set; }
}
