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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import es.justo.giiis.pi.dao.JDBCLabelDAOImpl;
import es.justo.giiis.pi.dao.JDBCUsersNotesDAOImpl;
import es.justo.giiis.pi.dao.LabelDAO;
import es.justo.giiis.pi.dao.UsersNotesDAO;
import es.justo.giiis.pi.model.Label;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;

@Path("/labels")
public class LabelResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Path("{noteid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Label> getLabelsJSON(@PathParam("noteid") long noteid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		LabelDAO labeldao = new JDBCLabelDAOImpl();
		labeldao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), noteid) == null)
			throw new CustomBadRequestException("The User cannot see the note");

		return labeldao.getAllByIdn(noteid);
	}

	@GET
	@Path("/search")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Label> getLabelsByContentJSON(@QueryParam("content") String content,
			@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		LabelDAO labeldao = new JDBCLabelDAOImpl();
		labeldao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		List<Label> to_return = new ArrayList<Label>();
		for (Label label : labeldao.getAllByContent(content))
			if (usersnotesdao.get(user.getIdu(), label.getIdn()) != null)
				to_return.add(label);

		return to_return;
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createLabel(Label label, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		LabelDAO labeldao = new JDBCLabelDAOImpl();
		labeldao.setConnection(conn);
		UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
		usersnotesdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersnotesdao.get(user.getIdu(), label.getIdn()) == null)
			throw new CustomBadRequestException("The User cannot create labels for this note");
		labeldao.add(label);

		Response res = Response.created(uriInfo.getAbsolutePathBuilder().path(Long.toString(label.getIdn())).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(Long.toString(label.getIdn())).build()).build();
		return res;
	}

	/****/
	 @DELETE
	 @Path("/{noteid: [0-9]+}/{content: [a-zA-Z]+}")
	 public Response deleteLabel(@PathParam("noteid") int noteid, @PathParam("content") String content, @Context HttpServletRequest request) {
	 Connection conn = (Connection) sc.getAttribute("dbConn");
	 LabelDAO labeldao = new JDBCLabelDAOImpl();
	 labeldao.setConnection(conn);
	 UsersNotesDAO usersnotesdao = new JDBCUsersNotesDAOImpl();
	 usersnotesdao.setConnection(conn);
	
	 HttpSession session = request.getSession();
	 User user = (User) session.getAttribute("user");
	 if(usersnotesdao.get(user.getIdu(), noteid) == null)
	 throw new CustomBadRequestException("The User cannot delete labels for this note");
	
	 labeldao.delete(noteid, content);
	
	 return Response.noContent().build();
	 }
	/** NO UPDATE, SOLO DELETE **/
}
