<%@ page contentType="text/xml; charset=UTF-8" language="java" errorPage="" 
    import="java.util.*,
            java.io.*,
            java.util.Base64.*"
%><%!
  private static String uploadDir = "/Users/maninzoo/Contents/temp/07_05_2016/gear/upload/";

  private static String getStringFromInputStream( InputStream is ) {
    BufferedReader br = null;
    StringBuilder sb = new StringBuilder();
    String line;

    try {
      br = new BufferedReader(new InputStreamReader(is));
      while ((line = br.readLine()) != null) {
        sb.append(line);
      }
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (br != null) {
        try {
          br.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
 
    return sb.toString();
  }

  private static void closeStream( FileOutputStream fos, InputStream in ) {
    try { if ( fos != null ) { fos.flush(); } } catch ( IOException e ) {}
    try { if ( fos != null ) { fos.close(); } } catch ( IOException e ) {}
    try { if ( in != null ) { in.close(); } } catch ( IOException e ) {}
  }  
%><%
  InputStream in = null;
  FileOutputStream fos = null;

  String mediatype = "";

	try {
    String contentType = request.getContentType();
    if ( contentType != null ) {
      if ( contentType.indexOf( ";" ) > 0 ) {
        mediatype = contentType.substring( 0, contentType.indexOf( ";" ) );
      } else {
        mediatype = contentType;
      }
    }
    System.out.println( "contentType " + contentType + " mediatype " + mediatype );

    String srcType = request.getParameter("srcType");
    System.out.println( "srcType " + srcType );

    if ( srcType.equals("Base64") ) {
      String imageData = getStringFromInputStream( request.getInputStream() );
      Decoder base64Decoder = Base64.getDecoder();
      fos = new FileOutputStream( uploadDir + "test." + System.currentTimeMillis() + ".bmp" );
      fos.write( base64Decoder.decode( imageData.getBytes() ) );
    } else if ( srcType.equals("Binary") ) {
      byte[] data = new byte[1024];
      int length = 0;
      in = request.getInputStream();
      fos = new FileOutputStream( uploadDir + "test." + System.currentTimeMillis() + ".bmp" );

      while( ( length = in.read(data) ) != -1 ) {
        fos.write( data, 0, length );
      }
    }
	} catch( Exception e ) {
		e.printStackTrace();
	} finally {
        closeStream( fos, in );
	}
%>