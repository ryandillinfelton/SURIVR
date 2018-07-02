CC = g++
CFLAGS = -g -Wall
SRCS = shiftTrack.cpp
PROG = shiftTrack

OPENCV = `pkg-config opencv --cflags --libs`
LIBS = $(OPENCV)

$(PROG):$(SRCS)
	$(CC) $(CFLAGS) -o $(PROG) $(SRCS) $(LIBS)