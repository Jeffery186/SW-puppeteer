all:	data plots

data:
	./prepareData.sh

plots:
	gnuplot plot.gnu
	epstopdf rank_cdf.eps
	

clean:
	rm -f *.pdf
	rm -rf *.eps
