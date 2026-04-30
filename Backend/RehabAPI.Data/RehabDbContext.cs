using Microsoft.EntityFrameworkCore;
using RehabAPI.Models;

namespace RehabAPI.Data;

public class RehabDbContext : DbContext
{
    public RehabDbContext(DbContextOptions<RehabDbContext> options) : base(options) { }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<SessionMetric> SessionMetrics { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    base.OnModelCreating(modelBuilder);
    modelBuilder.Entity<Patient>(entity =>

    {

        entity.HasKey(e => e.Id);

        entity.HasIndex(e => e.NationalCode).IsUnique();

    });

    modelBuilder.Entity<Session>(entity =>

    {

        entity.HasKey(e => e.Id);

        entity.HasOne(e => e.Patient)

        .WithMany(p => p.Sessions)

        .HasForeignKey(e => e.PatientId)

        .OnDelete(DeleteBehavior.Cascade);

    });

    modelBuilder.Entity<SessionMetric>(entity =>

    {

        entity.HasKey(e => e.Id);

        entity.HasOne(e => e.Session)

        .WithMany(s => s.Metrics)

        .HasForeignKey(e => e.SessionId)

        .OnDelete(DeleteBehavior.Cascade);

    });

    }
}