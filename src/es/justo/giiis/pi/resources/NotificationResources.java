package es.justo.giiis.pi.resources;

import java.sql.Connection;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import es.justo.giiis.pi.dao.JDBCNotificationDAOImpl;
import es.justo.giiis.pi.dao.JDBCUsersFriendsImpl;
import es.justo.giiis.pi.dao.NotificationDAO;
import es.justo.giiis.pi.dao.UsersFriendsDAO;
import es.justo.giiis.pi.model.Notification;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;

@Path("/notifications")
public class NotificationResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Notification> getNotesJSON(@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NotificationDAO notificationdao = new JDBCNotificationDAOImpl();
		notificationdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		return notificationdao.getAllByIdu(user.getIdu());
	}

	@GET
	@Path("/{friendid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Notification getUserFriendJSON(@PathParam("friendid") int friendid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NotificationDAO notificationdao = new JDBCNotificationDAOImpl();
		notificationdao.setConnection(conn); 

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		Notification notification = notificationdao.get(user.getIdu(), friendid);
		if (notification == null)
			throw new CustomBadRequestException("The notification doesn't exist");

		return notification;
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createNotification(Notification notification, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);
		
		NotificationDAO notificationdao = new JDBCNotificationDAOImpl();
		notificationdao.setConnection(conn);
		
		notificationdao.add(notification);

		Response res = null;
		return res;
	}
	
	@DELETE
	@Path("/{friendid: [0-9]+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteB(@PathParam("friendid") int friendid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		NotificationDAO notificationdao = new JDBCNotificationDAOImpl();
		notificationdao.setConnection(conn); 

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (notificationdao.get(user.getIdu(), friendid) != null)
			notificationdao.delete(new Notification(user.getIdu(), friendid));

		return Response.noContent().build();
	}
}
