<script>
/*
Window Keys plugin for ICEcoder, by Matt Pass, v0.1.
Shows JavaScript global vars for live edit window (aka previewWindow) if open.
Otherwise, shows JavaScript global vars for ICEcoder window.
*/
if (top.ICEcoder.previewWindow.location) {
	console.log('Global vars for live edit window: previewWindow...');
	console.log(Object.keys(top.ICEcoder.previewWindow));
} else {
	console.log('Showing global vars for ICEcoder window. View live edit preview window to see global vars for that.');
	console.log(Object.keys(top));
}
</script>