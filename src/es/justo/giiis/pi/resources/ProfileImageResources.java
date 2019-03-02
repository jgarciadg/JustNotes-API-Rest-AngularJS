package es.justo.giiis.pi.resources;

import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import es.justo.giiis.pi.dao.JDBCProfileImageDAOImpl;
import es.justo.giiis.pi.dao.ProfileImageDAO;
import es.justo.giiis.pi.model.ProfileImage;

@Path("/profileimages")
public class ProfileImageResources {
	@Context
	ServletContext sc;
	@Context
	UriInfo uriInfo;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<ProfileImage> getProfileImagesJSON(@Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		ProfileImageDAO profileimagedao = new JDBCProfileImageDAOImpl();
		profileimagedao.setConnection(conn);

		return profileimagedao.getAll();
	}

	/** TODO: PROTEGER **/
	@GET
	@Path("{imageid: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public ProfileImage getProfileImageJSON(@PathParam("imageid") int imageid, @Context HttpServletRequest request) {
		Connection conn = (Connection) sc.getAttribute("dbConn");
		ProfileImageDAO profileimagedao = new JDBCProfileImageDAOImpl();
		profileimagedao.setConnection(conn);

		return profileimagedao.getByIdi(imageid);
	}

	/*****************************************************
	 * NO DELETE NI UPDATE(PUT) DADO QUE SON DE LA PAGINA*
	 ****************************************************/
}
