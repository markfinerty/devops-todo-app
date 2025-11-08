output "todo_server_public_ip" {
  description = "Public IP of the todo API server"
  value       = aws_instance.todo_server.public_ip
}
