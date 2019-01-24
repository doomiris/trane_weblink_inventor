' VB Document
Function getRemoteWorkspace()
	msgbox oApp.UserName
	Dim oLoc As Inventor.FileLocations
	Set oLoc = oApp.FileLocations
	Dim asNames() As String
	Dim asPaths() As String
	Dim iNumWorkgroups As Long
	Call oLoc.Workgroups(iNumWorkgroups, asNames, asPaths)
	dim oWP As String
	If iNumWorkgroups = 0 Then
		oWP = oLoc.Workspace & "\"
	Else:
		oWP = asPaths(0) & "\"
	End If
	Set oLoc=nothing
	getRemoteWorkspace=oWP
End Sub