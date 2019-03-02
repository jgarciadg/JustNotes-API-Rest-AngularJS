package es.justo.giiis.pi.resources;

import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import es.justo.giiis.pi.dao.JDBCUsersNotesDAOImpl;
import es.justo.giiis.pi.dao.JDBCVersionsNotesDAO;
import es.justo.giiis.pi.dao.UsersNotesDAO;
import es.justo.giiis.pi.dao.VersionsNotesDAO;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.model.VersionsNotes;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;

@Path("/notes/{noteid: [0-9]+}/versions")
public class VersionsNotesResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<VersionsNotes> getVersionsJSON(@PathParam("noteid") int noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		VersionsNotesDAO versionsnotesdao = new JDBCVersionsNotesDAO();
		versionsnotesdao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), noteid) == null)
			throw new CustomBadRequestException("The User cannot see the note");

		return versionsnotesdao.getAllByIdn(noteid);
	}

	@GET
	@Path("/{timestamp: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public VersionsNotes getVersionJSON(@PathParam("timestamp") String timestamp, @PathParam("noteid") int noteid,
			@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		VersionsNotesDAO versionsnotesdao = new JDBCVersionsNotesDAO();
		versionsnotesdao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), noteid) == null)
			throw new CustomBadRequestException("The User cannot see the note");

		return versionsnotesdao.get(noteid, timestamp);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createVersion(VersionsNotes version, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		VersionsNotesDAO versionsnotesdao = new JDBCVersionsNotesDAO();
		versionsnotesdao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), version.getIdn()) == null)
			throw new CustomBadRequestException("The User cannot create a new version for this note");

		versionsnotesdao.add(version);

		Response res = Response.created(uriInfo.getAbsolutePathBuilder().path(version.getTimestamp()).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(version.getTimestamp()).build()).build();
		return res;
	}

}
