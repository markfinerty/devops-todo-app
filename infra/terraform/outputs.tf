output "instance_public_ip" {
  value = aws_instance.todo_api.public_ip
}