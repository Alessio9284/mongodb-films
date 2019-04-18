function place_holder(e, elem)
{
	//console.log(e.target.value);

	if(e.target.value == "")
	{
		$($(".placeholder")[elem]).show();
	}
	else
	{
		$($(".placeholder")[elem]).hide();
	}
}