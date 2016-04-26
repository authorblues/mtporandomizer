function updatePreset(val)
{
	var preset = val instanceof Number ? val : +$('#preset').val();
	if (preset > 0) $('.presetoption').prop('checked', false);

	if (preset == 0) return;


}

$('#preset').change(updatePreset);

// selecting any option by hand should set the preset box to "custom"
$('.presetoption').click(function()
{
	$('#preset').val(0);
});

var PRESET_NAMES =
[
	"Custom",
];

function getPresetName(n)
{
	if (n === undefined) n = $('#preset').val();
	return PRESET_NAMES[n] || PRESET_NAMES[0];
}

var RANDOMIZER_SETTINGS = [];
$('.presetoption').each(function(){ RANDOMIZER_SETTINGS.push(this); });

function getRandomizerSettings()
{
	var bitset = $.map(RANDOMIZER_SETTINGS, function(x){ return $(x).is(':checked'); });
	return bitsToHex(bitset);
}

function setRandomizerSettings(set)
{
	var bitset = hexToBits(set);
	for (var i = 0; i < RANDOMIZER_SETTINGS.length; ++i)
	{
		var x = i > bitset.length ? 0 : bitset[i];
		$(RANDOMIZER_SETTINGS[i]).prop('checked', x);
	}
}
