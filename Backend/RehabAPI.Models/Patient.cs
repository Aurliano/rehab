using System.ComponentModel.DataAnnotations;

namespace RehabAPI.Models;

public class Patient
{
    public int Id { get; set; }

    [Required(ErrorMessage = "نام الزامی است")]
    [StringLength(50, ErrorMessage = "نام نباید بیشتر از 50 کاراکتر باشد")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "نام خانوادگی الزامی است")]
    [StringLength(50, ErrorMessage = "نام خانوادگی نباید بیشتر از 50 کاراکتر باشد")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "کد ملی الزامی است")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "کد ملی باید 10 رقم باشد")]
    public string NationalCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "تاریخ تولد الزامی است")]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public Gender Gender { get; set; }

    [Phone(ErrorMessage = "شماره تلفن نامعتبر است")]
    public string? PhoneNumber { get; set; }

    [Required]
    public InjuryType InjuryType { get; set; }

    [Required]
    public AffectedSide AffectedSide { get; set; }

    [Required(ErrorMessage = "تاریخ آسیب الزامی است")]
    public DateTime InjuryDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}
