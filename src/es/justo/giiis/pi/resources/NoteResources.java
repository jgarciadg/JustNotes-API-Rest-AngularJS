package es.justo.giiis.pi.resources;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collections;
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
import es.justo.giiis.pi.dao.JDBCUsersNotesDAOImpl;
import es.justo.giiis.pi.dao.JDBCVersionsNotesDAO;
import es.justo.giiis.pi.dao.NoteDAO;
import es.justo.giiis.pi.dao.UsersNotesDAO;
import es.justo.giiis.pi.dao.VersionsNotesDAO;
import es.justo.giiis.pi.model.Note;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.model.UsersNotes;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;
import es.justo.giiis.pi.util.QueryParameters;

@Path("/notes")
public class NoteResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Note> getNotesJSON(@Context HttpServletRequest request) {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		Connection connection = (Connection) sc.getAttribute("dbConn");
		UsersNotesDAO usernotesdao = new JDBCUsersNotesDAOImpl();
		usernotesdao.setConnection(connection);
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(connection);

		List<UsersNotes> usernotes = usernotesdao.getAllByUser(user.getIdu());
		Collections.sort(usernotes);

		List<Note> notes = new ArrayList<Note>();
		for (UsersNotes usernote : usernotes) 
			notes.add(notedao.get(usernote.getIdn()));

		return notes;
	}
	

	@GET
	@Path("/searcht")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Note> getNotesUserByTitleJSON(@QueryParam("title") String title, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		List<Note> to_return = new ArrayList<Note>();
		for (Note note : notedao.getAllBySearchTitle(title))
			if (usersnotesdao.get(user.getIdu(), note.getIdn()) != null)
				to_return.add(note);

		return to_return;
	}

	@GET
	@Path("/searchc")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Note> getNotesUserByContentJSON(@QueryParam("content") String content,
			@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		List<Note> to_return = new ArrayList<Note>();
		for (Note note : notedao.getAllBySearchTitle(content))
			if (usersnotesdao.get(user.getIdu(), note.getIdn()) != null)
				to_return.add(note);

		return to_return;
	}

	@GET
	@Path("/searchq")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Note> getNotesUserBySearchJSON(@QueryParam("query") String query, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		List<Note> to_return = new ArrayList<Note>();
		for (Note note : notedao.getAllBySearchAll(query))
			if (usersnotesdao.get(user.getIdu(), note.getIdn()) != null)
				to_return.add(note);

		return to_return;
	}

	@GET
	@Path("/{noteid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Note getNoteJSON(@PathParam("noteid") long noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), noteid) == null)
			throw new CustomBadRequestException("The User cannot see the note");

		return notedao.get(noteid);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createNote(Note newNote, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		List<String> errors = new ArrayList<String>();
		if (!newNote.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");

		long idn = notedao.add(newNote);
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		usersnotesdao.add(new UsersNotes(user.getIdu(), (int) idn, QueryParameters.NO_COLOR));

		Response res = Response.created(uriInfo.getAbsolutePathBuilder().path(Long.toString(idn)).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(Long.toString(idn)).build()).build();
		return res;
	}

	@PUT
	@Path("/{noteid: [0-9]+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateNote(Note noteUpdated, @PathParam("noteid") long noteid,
			@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);

		Response res = null;

		List<String> errors = new ArrayList<String>();
		if (!noteUpdated.validate(errors))
			throw new CustomBadRequestException("Errors in parameters");
		else if (!noteUpdated.equals(notedao.get(noteid)))
			notedao.save(noteUpdated);

		return res;
	}

	@DELETE
	@Path("/{noteid: [0-9]+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteNote(@PathParam("noteid") long noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NoteDAO notedao = new JDBCNoteDAOImpl();
		notedao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);
		VersionsNotesDAO versionsnotesdao = new JDBCVersionsNotesDAO();
		versionsnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), noteid) == null)
			throw new CustomBadRequestException("The User cannot delete the note");

		notedao.delete(noteid);
		usersnotesdao.deleteAll(noteid);
		versionsnotesdao.deleteAllByIdn((int) noteid);
		
		return Response.noContent().build();
	}

}
