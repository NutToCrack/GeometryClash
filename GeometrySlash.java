import javax.swing.JFrame;
import java.awt.*; // AWT package is responsible for creating GUI
import javax.swing.*; // Java swing package is responsible to provide UI components
// AWT class extents Jframe which is part of Swing package

public class GeometrySlash extends JFrame {
    /**
    *
    */
    // Defining all the static variables
    private static final long serialVersionUID = 1L;
    public static final int SAMPLE_CANVAS_WIDTH = 500;
    public static final int SAMPLE_CANVAS_HEIGHT = 500;

    // The program enters from the main method
    public static void main(String[] args) {
        // display
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new GeometrySlash(); // this run method will create a new object and thus invoke the constructor
                                     // method.
                while (true) // window open
                {

                }
            }
        });
    }

    // Here we are creating an instance of the drawing canvas inner class called
    // DrawCanwas
    private DrawCanvas sampleCanvas;

    public GeometrySlash() {
        sampleCanvas = new DrawCanvas();
        sampleCanvas.setPreferredSize(new Dimension(SAMPLE_CANVAS_WIDTH, SAMPLE_CANVAS_HEIGHT));
        Container containerPane = getContentPane();
        containerPane.add(sampleCanvas);
        setDefaultCloseOperation(EXIT_ON_CLOSE); // setting up the default close mechanism
        pack();
        setTitle("......"); // set the desired title of the JFrame
        setVisible(true); // setVisible method will be set the visibility of the Jframe to true
    }

    /**
     * here drawCanvas is the inner class of the Jpanel which is used for custom
     * drawing
     */
    private class DrawCanvas extends JPanel {
        /**
        *
        */
        private static final long serialVersionUID = 1L;

        // Overriding paintComponent will let you to design your own painting
        @Override
        public void paintComponent(Graphics graphics) {
            super.paintComponent(graphics);
            setBackground(Color.BLACK); // setting the background color to black
            graphics.setColor(Color.GREEN); // setting up the color to green
            graphics.drawLine(30, 40, 100, 200);
            graphics.drawOval(150, 180, 10, 10);
            graphics.drawRect(200, 210, 20, 30);
            graphics.setColor(Color.magenta);
            graphics.fillOval(300, 310, 30, 50);
            graphics.fillRect(400, 350, 60, 50);
            graphics.setColor(Color.WHITE);
            graphics.setFont(new Font("Monospaced", Font.PLAIN, 12)); // setting up the font style and font size
            graphics.drawString("Java Graphics in 2D ...", 10, 20);
        }
    }
}