genhm(){
	ROOM=$1
	[[ -e map2/$1.png ]] || convert map/$1.png -scale 50 map2/$1.png
	[[ -e heightmap/$1.png ]] || convert map2/$1.png -threshold 10% -negate heightmap/$1.png
}

for X in {0..50}
do
	for Y in {0..50}
	do
		echo $X $Y
		genhm "E"$X"N"$Y
		genhm "E"$X"S"$Y
		genhm "W"$X"N"$Y
		genhm "W"$X"S"$Y
	done
done
