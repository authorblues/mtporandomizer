var VERSION_STRING = 'v0.1';

function randomizeROM(buffer, seed)
{
	var ext = '.nes';

	var random = new Random(seed);
	var vseed = random.seed.toHex(8);

	$('#custom-seed').val('');
	$('#used-seed').text(vseed);

	var rom = new Uint8Array(buffer);

	if ($('#randomize_roundlength').is(':checked'))
		randomizeRoundLength(random, rom);

	if ($('#randomize_hearts').is(':checked'))
		randomizeHearts(random, rom);

	if ($('#glassjoe_patterns' ).is(':checked')) randomizeGlassJoePatterns(random, rom);
	if ($('#glassjoe_damage'   ).is(':checked')) randomizeGlassJoeDamage(random, rom);
	if ($('#glassjoe_threshold').is(':checked')) randomizeGlassJoeThreshold(random, rom);

	// update the location.hash
	var preset = +$('#preset').val();
	if (!preset) preset = 'x' + getRandomizerSettings();

	// return the modified buffer
	return { seed: vseed, preset: preset, buffer: rom.buffer, type: ext || '.nes' };
}

function toBinaryCodedDecimal(dec)
{ return (Math.floor(dec/10) << 4) | (dec%10); }

function randomizeRoundLength(random, rom)
{
	rom[0x0E7D2] = 1 + random.nextInt(5);
	rom[0x0E80E] = rom[0x0E7D2] + 1;
}

function randomizeHearts(random, rom)
{
	// hearts lost when opponent lands punch on Mac
	rom[0x0E154] = random.nextIntRange(0x06, 0x10);

	// hearts lost when Mac blocks a punch
	rom[0x0E0E2] = random.nextIntRange(0x01, 0x06);

	// Glass Joe
	rom[0x0132C] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 1
	rom[0x0132F] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 2
	rom[0x01330] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 3
	rom[0x0132D] = toBinaryCodedDecimal(1 + random.nextInt(15)); // after running out and dodging
	rom[0x0132E] = toBinaryCodedDecimal(1 + random.nextInt( 9)); // after getting up from KO
}

function randomizeGlassJoePatterns(random, rom)
{
	rom[0x01434] = random.nextIntRange(0x0A, 0xB6); // timing of round 1 charge attack
	rom[0x01450] = random.nextIntRange(0x0A, 0xB6); // timing of round 2 charge attack
	rom[0x0145F] = random.nextIntRange(0x0A, 0xB6); // timing of round 3 charge attack

	rom[0x0146C] = random.from([0x73, 0x78]); // wait until charge in round 1 before punching (73=y, 78=n)
	rom[0x01476] = random.from([0x80, 0x50]); // can dodge? (80=y, 50=n)

	// number of punches before being awarded stars 1st and subsequent times
	rom[0x01336] = 3 + Math.min(Math.floor(Math.abs(random.nextGaussian() * 10)), 100);
	rom[0x01337] = 5 + Math.min(Math.floor(Math.abs(random.nextGaussian() * 10)), 100);

	// downtime values
	for (var i = 0; i < 8; ++i) rom[0x01366+i] = random.nextIntRange(0x9B, 0xA3);

	// special scenario downtime values (XY, X = count, Y = health when up)
	rom[0x013D7] = (random.nextIntRange(0x01, 0x0A) << 4) | random.nextIntRange(0x01, 0x0D);

	rom[0x01083] = 1 + random.nextInt(0xFF); // GJ waiting time before charging
	rom[0x01387] = random.nextInt(0x08); // # of hits when stunned (dodge hook)
	rom[0x00C1B] = random.nextInt(0x08); // # of hits when stunned (block)
	rom[0x00C25] = random.nextInt(0x08); // # of hits when stunned (jab and ducking)

	rom[0x17A87] = random.from([0x04, 0x05]); // situation 1 (04=blocks, 05=punch lands)
	rom[0x17AD3] = random.from([0x04, 0x05]); // situation 2 (04=blocks, 05=punch lands)
	rom[0x17B73] = random.from([0x04, 0x05]); // situation 3 (04=blocks, 05=punch lands)

	rom[0x01473] = random.nextIntRange(0x05, 0x61); // delay after blocking GJ's hook
	rom[0x00C1A] = random.nextIntRange(0x05, 0x31); // delay after blocking GJ's jab

	// chance of blocking in several scenarios
	var blockchance = 0.1 + random.nextFloat() * 0.7;
	console.log('glass joe block chance', blockchance);

	rom[0x00C6D] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B5] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	for (var i = 0x1C838; i <= 0x1C83F; ++i)
		rom[i] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	for (var i = 0x012BD; i <= 0x012BE; ++i)
		rom[i] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	for (var i = 0x012BB; i <= 0x012BC; ++i)
		rom[i] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// round 1 patterns
	rom.set(random.from([[0x80, 0xFF], [0x04, 0x95], [0x04, 0x96]]), 0x01484);
	rom[0x0148A] = random.nextIntRange(0x05, 0x46);
	rom[0x0148E] = random.from([0x95, 0x96]);
	rom[0x01491] = random.from([0x95, 0x96]);
	rom[0x01494] = random.from([0x95, 0x96]);
	rom[0x01498] = random.from([0x95, 0x96]);
	rom[0x0149B] = random.from([0x95, 0x96]);
	rom[0x0149E] = random.from([0x95, 0x96]);

	// round 2/3 patterns
	rom[0x014A7] = random.from([0x95, 0x96, 0x99]);
	rom[0x014A9] = random.from([0x95, 0x96, 0x99]);
	rom[0x014AD] = random.nextIntRange(0x05, 0x26);
	rom[0x014B1] = random.from([0x95, 0x96]);
	rom[0x014B4] = random.from([0x95, 0x96]);
	rom[0x014B7] = random.from([0x95, 0x96]);
	rom[0x014BB] = random.from([0x95, 0x96]);
	rom[0x014BE] = random.from([0x95, 0x96]);
	rom[0x014C1] = random.from([0x95, 0x96]);
}

function randomizeGlassJoeDamage(random, rom)
{
	rom[0x01359] = random.nextIntRange(0x00, 0x21); // damage to GJ from uppercut
	rom[0x17C1F] = random.nextIntRange(0x06, 0x20); // damage to opponent from uppercut (high, low)
	rom[0x00DB8] = random.nextIntRange(0x00, Math.min(0x09, rom[0x17C1F]));

	// health when GJ gets back up in each of 7 different situations
	for (var i = 0; i < 7; ++i) rom[0x013E0+i] = random.nextIntRange(0x03, 0x0D);
}

function randomizeGlassJoeThreshold(random, rom)
{
	rom[0x0134F] = random.nextInt( 2); // points in 10,000s
	rom[0x01350] = random.nextInt(10); // points in  1,000s
}
