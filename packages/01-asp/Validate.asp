<%@ Language="VBScript" %>
<%
Option Explicit
%>


<%
DIM importer, code
Set importer = CreateObject("Scripting.FileSystemObject")
code = importer.OpenTextFile(Server.MapPath("./json.vbs")).ReadAll
ExecuteGlobal code

DIM fso
DIM reader
DIM fileContents
SET fso = Server.CreateObject("Scripting.FileSystemObject") 
SET reader = fso.OpenTextFile(Server.MapPath("./trivia.json"), 1, false)
fileContents = reader.ReadAll
reader.Close

DIM json
Set json = New VbsJson
DIM o
Set o = json.Decode(fileContents)

DIM question, questionId, answer, correct

questionId = Request.Form("questionId")
answer = Request.Form("answer")

SET question = o("questions")(questionId)
correct = answer = question("correct_answer")
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivia App - Classic ASP Style</title>
    <link href="index.css" rel="stylesheet" />
</head>
<body>
    <h1>Check your answer!</h1>
    <section role="main">
      <h2><% Response.Write(question("question")) %></h2>
      <p>You provided the answer: <strong><% Response.Write(answer) %></strong>.</p>
      <p>The correct answer is: <strong><% Response.Write(question("correct_answer")) %></strong>.</p>
      <p>This means that you were <span class="<% IF correct = TRUE THEN Response.Write("right") ELSE Response.Write("wrong") END IF %>"><% IF correct = TRUE THEN Response.Write("right") ELSE Response.Write("wrong") END IF %></span>.</p>
      <p><a href="/Default.asp">Play again?</a></p>
    </section>
</body>
</html>
