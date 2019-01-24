' VB Script Document
function getRemoteWorkspace()
	dim oLoc: set oLoc=oApp.FileLocations
	Dim asNames(),asPaths(),iNumWorkgroups
	Call oLoc.Workgroups(iNumWorkgroups, asNames, asPaths)
	dim oWP
	if iNumWorkgroups = 0 then
		oWP = oLoc.Workspace & "\"
	else
		oWP = asPaths(0) & "\"
	end if
	set oLoc=nothing
	set inv=nothing
	getRemoteWorkspace=oWP
end function