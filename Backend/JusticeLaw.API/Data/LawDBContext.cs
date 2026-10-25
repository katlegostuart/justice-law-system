using JusticeLaw.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace JusticeLaw.API.Data
{
    public class LawDBContext : IdentityDbContext<IdentityUser>
    {
        public LawDBContext(DbContextOptions<LawDBContext> options) : base(options)
        {

        }

        // One DbSet per entity = one table per entity
        public DbSet<Client> Clients { get; set; }
        public DbSet<Attorney> Attorneys { get; set; }
        public DbSet<CaseType> CaseTypes { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<LegalTask> LegalTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // These numbers must be unique
            modelBuilder.Entity<Client>().HasIndex(c => c.ClientNumber).IsUnique();
            modelBuilder.Entity<Attorney>().HasIndex(a => a.StaffNumber).IsUnique();
            modelBuilder.Entity<Case>().HasIndex(c => c.CaseNumber).IsUnique();
            modelBuilder.Entity<LegalTask>().HasIndex(t => t.TaskNumber).IsUnique();

            // Don't allow deleting a Client, Attorney or Case Type that still has cases
            modelBuilder.Entity<Case>()
                .HasOne(c => c.Client).WithMany(c => c.Cases)
                .HasForeignKey(c => c.ClientId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Case>()
                .HasOne(c => c.Attorney).WithMany(a => a.Cases)
                .HasForeignKey(c => c.AttorneyId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Case>()
                .HasOne(c => c.CaseType).WithMany(t => t.Cases)
                .HasForeignKey(c => c.CaseTypeId).OnDelete(DeleteBehavior.Restrict);

            // Deleting a Case deletes its Legal Tasks
            modelBuilder.Entity<LegalTask>()
                .HasOne(t => t.Case).WithMany(c => c.LegalTasks)
                .HasForeignKey(t => t.CaseId).OnDelete(DeleteBehavior.Cascade);

        }
    }
}
