<%@ Language="VBScript" %>
<%
Option Explicit
%>

<script language="JScript" runat="server" src='json.js'></script>

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

DIM trivia
SET trivia = JSON.parse(fileContents)

Function RandomNumber(intHighestNumber)
	Randomize
	RandomNumber = Int(intHighestNumber * Rnd) + 1
End Function

DIM r
r = RandomNumber(trivia.questions.Length)

Set json = New VbsJson
DIM o
Set o = json.Decode(fileContents)
DIM question 
SET question = o("questions")(r)

%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivia App - AJAX Style</title>
    <link href="index.css" rel="stylesheet" />
</head>
<body>
    <h1>It's trivia time!</h1>
    <section role="main">
        <h2><% Response.Write(question("question")) %></h2>
        <form method="post" action="/Validate.asp">
        <input type="hidden" value="<% Response.Write(r) %>" name="questionId" id="questionId" />
        <ul>
            <%
            DIM answer

            For Each answer In question("incorrect_answers")
                Response.write("<li><label><input type=""radio"" name=""answer"" value=""" & answer & """ />" & answer & "</label></li>")
            Next

            Response.write("<li><label><input type=""radio"" name=""answer"" value=""" & question("correct_answer") & """ />" & question("correct_answer") & "</label></li>")
            %>
        </ul>
        <button type="submit">Check your answer</button>
        </form>

        <div class="result hidden">
            <p></p>
            <a href="Default.asp">Play again?</a>
        </div>
    </section>
    <script src="ajax.js"></script>
</body>
</html>