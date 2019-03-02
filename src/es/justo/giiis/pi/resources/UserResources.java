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

import es.justo.giiis.pi.dao.JDBCLabelDAOImpl;
import es.justo.giiis.pi.dao.JDBCNoteDAOImpl;
import es.justo.giiis.pi.dao.JDBCUserDAOImpl;
import es.justo.giiis.pi.dao.JDBCUsersFriendsImpl;
import es.justo.giiis.pi.dao.JDBCUsersNotesDAOImpl;
import es.justo.giiis.pi.dao.JDBCVersionsNotesDAO;
import es.justo.giiis.pi.dao.LabelDAO;
import es.justo.giiis.pi.dao.NoteDAO;
import es.justo.giiis.pi.dao.UserDAO;
import es.justo.giiis.pi.dao.UsersFriendsDAO;
import es.justo.giiis.pi.dao.UsersNotesDAO;
import es.justo.giiis.pi.dao.VersionsNotesDAO;
import es.justo.giiis.pi.model.Note;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.model.UsersFriends;
import es.justo.giiis.pi.model.UsersNotes;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;
import es.justo.giiis.pi.resources.exceptions.CustomNotFoundException;

@Path("/users")
public class UserResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public User getUsersJSON(@Context HttpServletRequest request) {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		return user;
	}

	@GET
	@Path("/{userid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUserJSON(@PathParam("userid") long userid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);
		
		User user = userdao.get(userid);
		
		user.setPassword("**********");
		
		return user;
	}
	
	
	@GET
	@Path("/u/")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUsersByUsernameJSON(@QueryParam("username") String username, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		User user = userdao.get(username);
		if (user != null) {
			user.setPassword("**********");
			return user;
		}
		else
			throw new CustomNotFoundException("User (" + username + ") is not found");
	}
	
	@GET
	@Path("/usernamePattern/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<User> getUsersByUsernamePatternJSON(@QueryParam("username") String username, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		HttpSession session = request.getSession();
		User usero = (User) session.getAttribute("user");

		List<User> allusers = userdao.getAll();
		List<User> users = new ArrayList<User>();
		for(User user : allusers) {
			if(user.getUsername().contains(username) && !user.getUsername().equals(usero.getUsername())) {
				user.setPassword("**********");
				users.add(user);
			}
		}
		return users;
	}
	
	@GET
	@Path("/e/")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUsersByEmailJSON(@QueryParam("email") String email, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		User user = userdao.getByEmail(email);
		if (user != null) {
			user.setPassword("**********");
			return user;
		}
		else
			throw new CustomNotFoundException("User (" + email + ") is not found");
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createUser(User newUser, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		List<String> errors = new ArrayList<String>();
		if (!newUser.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");

		long idu = userdao.add(newUser);

		Response res = Response.created(uriInfo.getAbsolutePathBuilder().path(Long.toString(idu)).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(Long.toString(idu)).build()).build();
		return res;
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateUser(User userUpdated, @Context HttpServletRequest request) {
		HttpSession session = request.getSession();

		Response res = null;

		List<String> errors = new ArrayList<String>();
		if (!userUpdated.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");

		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		userdao.save(userUpdated);
		session.setAttribute("user", userUpdated);

		return res;
	}

	@DELETE
	public Response deleteUser(@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UserDAO userdao = new JDBCUserDAOImpl();
		userdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);
		NoteDAO notesdao = new JDBCNoteDAOImpl();
		notesdao.setConnection(conn);
		VersionsNotesDAO versionsnotesdao = new JDBCVersionsNotesDAO();
		versionsnotesdao.setConnection(conn);
		LabelDAO labeldao = new JDBCLabelDAOImpl();
		labeldao.setConnection(conn);

		List<UsersNotes> usernotes = usersnotesdao.getAllByUser(user.getIdu());
		List<Note> notes = new ArrayList<Note>();
		List<Note> notesOwner = new ArrayList<Note>();
		for (UsersNotes usernote : usernotes) {
			Note note = notesdao.get(usernote.getIdn());
			if (usernote.getOwner() == 1)
				notesOwner.add(note);
			else
				notes.add(note);
		}

		for (Note note : notes)
			usersnotesdao.delete(user.getIdu(), note.getIdn());

		for (Note note : notesOwner) {
			notesdao.delete(note.getIdn());
			usersnotesdao.deleteAll(note.getIdn());
			versionsnotesdao.deleteAllByIdn(note.getIdn());
			labeldao.deleteAll(note.getIdn());
		}

		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);
		List<UsersFriends> userfriends = usersfriendsdao.getAllByIdu(user.getIdu());
		for (UsersFriends userfriend : userfriends) {
			usersfriendsdao.delete(userfriend);
			usersfriendsdao.delete(new UsersFriends(userfriend.getIdfriend(), userfriend.getIdu()));
		}

		userdao.delete(user.getIdu());
		session.removeAttribute("user");
		
		return Response.noContent().build();
	}

}
