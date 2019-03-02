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

import es.justo.giiis.pi.dao.JDBCUsersFriendsImpl;
import es.justo.giiis.pi.dao.UsersFriendsDAO;
import es.justo.giiis.pi.model.User;
import es.justo.giiis.pi.model.UsersFriends;
import es.justo.giiis.pi.resources.exceptions.CustomBadRequestException;

@Path("/usersfriends")
public class UsersFriendsResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<UsersFriends> getUsersFriendsJSON(@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");

		return usersfriendsdao.getAllByIdu(user.getIdu());
	}

	@GET
	@Path("/{friendid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public UsersFriends getUserFriendJSON(@PathParam("friendid") int friendid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		
		UsersFriends userfriend = usersfriendsdao.get(user.getIdu(), friendid);
		if (userfriend == null)
			throw new CustomBadRequestException("The User cannot see the note");

		return userfriend;
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createUserFriend(UsersFriends userfriend, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		
		if (userfriend.getIdu() != user.getIdu())
			throw new CustomBadRequestException("The User didnt send a notification");

		usersfriendsdao.add(userfriend);
		usersfriendsdao.add(new UsersFriends(userfriend.getIdfriend(), userfriend.getIdu()));

		Response res = Response
				.created(uriInfo.getAbsolutePathBuilder().path(Long.toString(userfriend.getIdfriend())).build())
				.contentLocation(uriInfo.getAbsolutePathBuilder().path(Long.toString(userfriend.getIdfriend())).build())
				.build();
		return res;
	}

	/** NO PUT, NO SE MODIFICAN **/

	@DELETE
	@Path("/{friendid: [0-9]+}")
	public Response deleteUserFriend(@PathParam("friendid") int friendid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		UsersFriendsDAO usersfriendsdao = new JDBCUsersFriendsImpl();
		usersfriendsdao.setConnection(conn);

		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		if (usersfriendsdao.get(user.getIdu(), friendid) != null)
			usersfriendsdao.delete(new UsersFriends(user.getIdu(), friendid));

		return Response.noContent().build();
	}

}
