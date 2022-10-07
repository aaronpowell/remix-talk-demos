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

CALL Response.AddHeader("Content-Type", "application/json")
Response.Write("{""correct"": """ & correct & """, ""questionId"":" & question("id") & ", ""answer"": """ & answer & """, ""correctAnswer"": """ & question("correct_answer") & """ }")
%>

