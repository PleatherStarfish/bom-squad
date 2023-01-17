<script>
    import { onMount } from "svelte";
	let showComponent = true;
	let showQuantity = true;
	let showLocation = true;
	onMount(async () => {
      fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon")
      .then(response => response.json())
      .then(data => {
            console.log(data);
        apiData.set(data);
      }).catch(error => {
        console.log(error);
        return [];
      });
    });

	function toggleColumn(e, column) {
		switch (column) {
			case 0:
				showComponent = !showComponent;
				break;
			case 1:
				showQuantity = !showQuantity;
				break;
			case 2:
				showLocation = !showLocation;
				break;
		}
	}
</script>

<!--<table>-->
<!--    <thead>-->
<!--    <tr>-->
<!--        <th>Component</th>-->
<!--        <th>Quantity</th>-->
<!--        <th>Location</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    {#each zipped_data as item}-->
<!--        <tr>-->
<!--            <td>{item.1.component.description}</td>-->
<!--            <td>{item.1.quantity}</td>-->
<!--            <td>{item.0}</td>-->
<!--        </tr>-->
<!--    {/each}-->
<!--    </tbody>-->
<!--</table>-->