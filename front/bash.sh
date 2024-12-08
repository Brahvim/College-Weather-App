for $file in ./*.mp4 do
	base=$(basename "$file" ".mp4")
	ffpmeg -i "$file" -vf "$base.gif"
done