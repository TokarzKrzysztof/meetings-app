using System.Net.Mail;
using System.Net;
using RazorHtmlEmails.RazorClassLib.Services;

namespace Meetings.EmailSender
{
    public record EmailReceiver(string Email, string Name);
    public record EmailData(List<EmailReceiver> Receivers, string Subject, string TemplateName, object? Model);

    public interface IEmailSender
    {
        Task Send(EmailData data);
    }

    internal class EmailSender: IEmailSender
    {
        private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;
        public EmailSender(IRazorViewToStringRenderer razorViewToStringRenderer)
        {
            _razorViewToStringRenderer = razorViewToStringRenderer;
        }
        public async Task Send(EmailData data)
        {
            var message = new MailMessage();
            message.From = new MailAddress("meetingsteam0@gmail.com");
            foreach (var receiver in data.Receivers)
            {
                message.To.Add(new MailAddress(receiver.Email, receiver.Name));
            }

            message.Subject = data.Subject;
            message.Body = await _razorViewToStringRenderer.RenderViewToStringAsync($"/Views/{data.TemplateName}.cshtml", data.Model);
            message.IsBodyHtml = true;

            using (var client = new SmtpClient())
            {
                client.Host = "smtp.gmail.com";
                client.Port = 587;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential("meetingsteam0@gmail.com", "pgnhjuwufaesufho");

                client.Send(message);
            }
        }
    }
}
