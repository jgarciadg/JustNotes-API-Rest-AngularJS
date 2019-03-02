package es.justo.giiis.pi.resources;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import es.justo.giiis.pi.dao.JDBCNoteDAOImpl;
import es.justo.giiis.pi.dao.JDBCUsersFriendsImpl;
import es.justo.giiis.pi.dao.JDBCUsersNotesDAOImpl;
import es.justo.giiis.pi.dao.NoteDAO;
import es.justo.giiis.pi.dao.UsersFriendsDAO;
import es.justo.giiis.pi.dao.UsersNotesDAO;
import es.justo.giiis.pi.model.Note;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.model.UsersNotes;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;

@Path("/usersnotes")
public class UsersNotesResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<UsersNotes> getUsersNotesJSON(@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		return usersnotesdao.getAllByUser(user.getIdu());
	}

	@GET
	@Path("{noteid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public UsersNotes getUsersNote(@PathParam("noteid") long noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		UsersNotes usernote = usersnotesdao.get(user.getIdu(), noteid);
		if (usernote != null)
			return usersnotesdao.get(user.getIdu(), noteid);
		else
			throw new CustomBadRequestException("The User cannot see the note");
	}
	
	@GET
	@Path("/shared")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UsersNotes> getUsersNotesByShareJSON(@QueryParam("idfriend") String idn, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);
		
		List<UsersNotes> sharedUsersNotes = new ArrayList<UsersNotes>();

		if(usersfriendsdao.get(user.getIdu(), Integer.parseInt(idn)) != null) {
			List<UsersNotes> usernotes = usersnotesdao.getAllByUser(user.getIdu());
			List<UsersNotes> friendnotes = usersnotesdao.getAllByUser(Integer.parseInt(idn));
				
			for(UsersNotes usernote: usernotes) {
				if(friendnotes.contains(usernote)) {
					sharedUsersNotes.add(usernote);
				}
			}
		}else {
			throw new CustomBadRequestException("The Users aren't friends");
		}
		
		return sharedUsersNotes;
	}
	
	@GET
	@Path("/searchq")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UsersNotes> getNotesUserBySearchJSON(@QueryParam("query") String query, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		List<UsersNotes> to_return = new ArrayList<UsersNotes>();
		for (Note note : notedao.getAllBySearchAll(query)) {
			UsersNotes usernote = usersnotesdao.get(user.getIdu(), note.getIdn());
			if (usernote != null)
				to_return.add(usernote);
		}
		return to_return;
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createUsersNote(UsersNotes usernote, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		List<String> errors = new ArrayList<String>();
		if (!usernote.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");

		usersnotesdao.add(usernote);

		Response res = Response.created(uriInfo.getAbsolutePathBuilder().path(Long.toString(usernote.getIdn())).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(Long.toString(usernote.getIdn())).build())
				.build();
		return res;
	}

	@PUT
	@Path("{noteid: [0-9]+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateUsersNote(UsersNotes usernoteUpdated,
			@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		UsersNotes usernote = usersnotesdao.get(user.getIdu(), usernoteUpdated.getIdn());
		usernoteUpdated.setIdu(user.getIdu());
		List<String> errors = new ArrayList<String>();
		if (usernote == null)
			throw new CustomBadRequestException("The User cannot see the note");
		else if (!usernoteUpdated.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");
		usersnotesdao.save(usernoteUpdated);
		
		return null;
	}

	@DELETE
	@Path("/{noteid: [0-9]+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteUserNote(@PathParam("noteid") long noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		UsersNotes usernote = usersnotesdao.get(user.getIdu(), noteid);
		if (usernote == null)
			throw new CustomBadRequestException("The User cannot see the note");

		usersnotesdao.delete(user.getIdu(), noteid);

		return Response.noContent().build();
	}
}
