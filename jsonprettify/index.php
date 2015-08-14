<script>
// Prettify's the current JSON file with pretty printed formatting
// Takes into account the user set preference for tabs/spaces also
cM = top.ICEcoder.getcMInstance();
if (cM && top.ICEcoder.openFiles[top.ICEcoder.selectedTab-1].indexOf('.json') > -1) {
	var space = cM.getOption("indentWithTabs") ? "\t" : cM.getOption("indentUnit")
	cM.setValue(JSON.stringify(JSON.parse(cM.getValue()), null, space));
}
</script>