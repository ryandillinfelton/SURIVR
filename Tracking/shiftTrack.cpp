#include <stdio.h>
#include <opencv2/core/utility.hpp>
#include <opencv2/opencv.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/tracking.hpp>
#include <chrono>




using namespace cv;
using namespace std;

Mat isolateRed(Mat frame) {
	cvtColor(frame, frame, cv::COLOR_BGR2HSV);
	inRange(frame, Scalar(0,35,45), Scalar(0,255,255), frame);
	return frame;
}

int main(int argc, char const *argv[])
{
	VideoCapture stream1(0);
	namedWindow("Camera View", WINDOW_AUTOSIZE);

	//get a frame to select in
	Mat frame;
    stream1.read(frame);

    //select the bounding boxes of the two trackers
	vector<Rect> boundingBoxes;
	//convert to HSV
	//frame = isolateRed(frame);
	selectROIs("tracker selection",frame,boundingBoxes);

	//quit when the tracked object(s) is not provided
   	if(boundingBoxes.size()<1)
  		return 0;

	//create trackers
	MultiTracker trackers;
	trackers.add(TrackerKCF::create(), frame, boundingBoxes[0]);
	trackers.add(TrackerKCF::create(), frame, boundingBoxes[1]);

	printf("tracking now\n");
	while (stream1.read(frame)) {
        if (!frame.empty()) {
        	//isolate the red in the frame
        	//frame = isolateRed(frame);
        	//cvtColor(frame, frame, cv::COLOR_HSV2BGR);
        	trackers.update(frame);

        	rectangle( frame, trackers.getObjects()[0], Scalar( 255, 0, 0 ), 2, 1 );
        	rectangle( frame, trackers.getObjects()[1], Scalar( 0, 255, 0 ), 2, 1 );
   			printf("x: %f", trackers.getObjects()[0].br().x);
   			printf(" y: %f\n", trackers.getObjects()[0].br().y);

   			ofstream newFile("x.txt");
		    if(newFile.is_open())   
		    {
		        newFile << trackers.getObjects()[0].br().x;            
		    }
		    else 
		    {
		        //You're in trouble now Mr!
		    }


		    newFile.close();
        } else {
        	printf("ERROR: no frames\n");
        }
        imshow("tracking",frame);
        int k = waitKey(1);
        if (k == 27) break;
    }
	return 0;
}