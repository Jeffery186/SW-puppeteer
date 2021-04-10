set terminal postscript enhanced eps color defaultplex \
   leveldefault  colortext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 21

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set key inside bottom right samplen 2
set xlabel 'Popularity rank (10^{3})'
set ylabel 'CDF' offset 2,0
#plot  "data.txt" using 1:2 title 'Service Workers' with lines
set out "rank_cdf.eps"
ads=3289
first=2048
none=336

set label "Median" tc rgb "grey" at 5,0.53 font ",18"
set arrow from 0,0.5 to 60,0.5 nohead dashtype 2 lc rgb "#B8B8B8"
set arrow from 60,0 to 60,0.5 nohead dashtype 2 lc rgb "#B8B8B8"

set ytics offset 0.5,0
third=1771
#set format x "%0.1t 10^{%L}";

#plot "adThirdPartyServerDatafile.tsv" using 1:3 with lines lw 2 

a=0
cumulative_sum_a(x)=(a=a+x,a)
b=0
cumulative_sum_b(x)=(b=b+x,b)
c=0
cumulative_sum_c(x)=(c=c+x,c)
d=0
cumulative_sum_d(x)=(d=d+x,d)
plot "noServerAtAllDatafile.tsv" using ($1/1000):(cumulative_sum_c($2) / none) with lines lw 2 lt rgb "grey" title "SWs not connecting with any server", \
    "firstPartyOnlyDatafile.tsv" using ($1/1000):(cumulative_sum_b($2) / first) with lines lw 2 lt rgb "green" title "SWs connecting with  only 1st parties",\
	"thirdPartyServerDatafile.tsv" using ($1/1000):(cumulative_sum_d($2) / third) with lines lw 2 lt rgb "orange" title "SWs connecting with 3rd parties (not ads)", \
	"adThirdPartyServerDatafile.tsv" using ($1/1000):(cumulative_sum_a($2) / ads) with lines lw 2 lt rgb "red" title "SWs connecting with 3rd party (ads)" ,\
    
    