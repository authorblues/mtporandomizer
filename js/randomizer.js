var VERSION_STRING = 'v0.2';

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

	if ($('#randomize_patterns' ).is(':checked')) randomizePatterns(random, rom);
	if ($('#randomize_damage'   ).is(':checked')) randomizeDamage(random, rom);
	if ($('#randomize_threshold').is(':checked')) randomizeThreshold(random, rom);

	// return the modified buffer
	return { seed: vseed, buffer: rom.buffer, type: ext || '.nes' };
}

function toBinaryCodedDecimal(dec)
{ return (Math.floor(dec/10) << 4) | (dec%10); }

function combineNibbles(a, b)
{ return ((a & 0xF) << 4) | (b & 0xF); }

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

	// --------------------- GLASS JOE
	rom[0x0132C] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 1
	rom[0x0132F] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 2
	rom[0x01330] = toBinaryCodedDecimal(1 + random.nextInt(20)); // start round 3
	rom[0x0132D] = toBinaryCodedDecimal(1 + random.nextInt(15)); // after running out and dodging
	rom[0x0132E] = toBinaryCodedDecimal(1 + random.nextInt( 9)); // after getting up from KO

	// --------------------- VON KAISER
	rom[0x05279] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0527A] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0527B] = toBinaryCodedDecimal(1 + random.nextInt(15));
	rom[0x0527C] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0527D] = toBinaryCodedDecimal(1 + random.nextInt(15));
	rom[0x0527E] = toBinaryCodedDecimal(1 + random.nextInt(10));
	rom[0x0527F] = toBinaryCodedDecimal(1 + random.nextInt(20));

	for (var i = 0x052DF; i <= 0x052E7; ++i)
		rom[i] = (rom[i] & 0x0F) | (random.nextIntRange(1,4) << 4);

	// --------------------- PISTON HONDA
	rom[0x0BB4E] = toBinaryCodedDecimal(1 + random.nextInt(50));
	rom[0x0BB4F] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0BB50] = toBinaryCodedDecimal(1 + random.nextInt(10));
	rom[0x0BB51] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0BB52] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0BB53] = toBinaryCodedDecimal(1 + random.nextInt(10));
	rom[0x0BB54] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0BB55] = toBinaryCodedDecimal(1 + random.nextInt(20));
	rom[0x0BB56] = toBinaryCodedDecimal(1 + random.nextInt(10));

	// --------------------- DON FLAMENCO
	rom[0x014D9] = toBinaryCodedDecimal(1 + random.nextInt(10));
	rom[0x014DA] = toBinaryCodedDecimal(1 + random.nextInt( 7));
	rom[0x014DB] = toBinaryCodedDecimal(1 + random.nextInt( 3));
	rom[0x014DC] = toBinaryCodedDecimal(1 + random.nextInt( 7));
	rom[0x014DD] = toBinaryCodedDecimal(1 + random.nextInt( 5));
}

function randomizePatterns(random, rom)
{
	var z;
	var blockchance = 0.1 + random.nextFloat() * 0.7;

	for (var i = 0x1C838; i <= 0x1C83F; ++i)
		rom[i] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// --------------------- GLASS JOE
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
	blockchance = 0.1 + random.nextFloat() * 0.7;

	rom[0x00C6D] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B5] = random.flipCoin(blockchance) ? 0x08 : 0x00;

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

	// --------------------- VON KAISER
	blockchance = 0.1 + random.nextFloat() * 0.7;
	for (var i = 0x01366; i <= 0x0136D; ++i)
		rom[i] = random.nextIntRange(0x9B, 0xA3);

	// number of punches before getting stars
	rom[0x05283] = random.nextIntRange(0x01, 0x21);

	// hit patterns
	rom[0x053BB] = random.from([0x96, 0x97]);
	rom[0x053C1] = random.from([0x96, 0x97]);
	rom[0x053C6] = random.from([0x96, 0x97]);
	rom[0x053CC] = random.from([0x96, 0x97]);
	rom[0x053CE] = random.from([0x96, 0x97]);
	rom[0x053D3] = random.from([0x96, 0x97]);
	rom[0x053D5] = random.from([0x96, 0x97]);

	// defense patterns (shared with GREAT TIGER)
	rom[0x0521C] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0521D] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0521E] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0521F] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05222] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05223] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05224] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05225] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05228] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05229] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0522E] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0522F] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x05230] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// delay after punch
	rom[0x053A8] = random.nextInt(0x41);

	// --------------------- PISTON HONDA
	// blocking patterns (1&2)
	blockchance = 0.1 + random.nextFloat() * 0.7;
	rom[0x0B7A2] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7A3] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7A4] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7A5] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7AA] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7AB] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7AE] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7AF] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7B4] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7B5] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7B6] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0B7B7] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0AF91] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0AF92] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	rom[0x0BCEC] = random.nextIntRange(0x20, 0xC2); // time of 1st special R1
	rom[0x0BCF2] = random.nextIntRange(0x20, 0xC2); // time of 2nd special R1
	rom[0x0BCFB] = random.nextIntRange(0x20, 0xC2); // time of 1st special R2
	rom[0x0BCFD] = random.nextIntRange(0x20, 0xC2); // time of 2nd special R2
	rom[0x0BD0A] = random.nextIntRange(0x20, 0xC2); // time of 1st special R3
	rom[0x0BD0C] = random.nextIntRange(0x20, 0xC2); // time of 2nd special R3

	// attack patterns (1)
	var PH_ATTACK_VALUES = [0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9C];
	rom[0x0BD90] = random.from(PH_ATTACK_VALUES);
	rom[0x0BD0A] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA0] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA2] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA6] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA7] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA8] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDA9] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDAA] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDAB] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDB3] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDB4] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDB5] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDB6] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDB7] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC2] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC3] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC4] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC5] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC6] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC7] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC8] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDC9] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDCD] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDCE] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDCF] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDD0] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDD1] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDD2] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDD3] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDD4] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDDC] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDDE] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDE6] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDE8] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDEA] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDEC] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDF1] = random.from(PH_ATTACK_VALUES);
	rom[0x0BDF3] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE02] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE04] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE06] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE0C] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE0E] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE10] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE12] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE16] = random.from(PH_ATTACK_VALUES);
	rom[0x0BE18] = random.from(PH_ATTACK_VALUES);

	// # of punches PH does in special attack
	rom[0x0BD84] = random.nextIntRange(0x02, 0x1B);

	// setup for punching speed
	z = random.nextIntRange(0x02, 0x08);
	rom[0x0BD5D] = (rom[0x0BD5D] & 0x0F) | (z << 4);
	rom[0x0BD5C] = random.nextIntRange(Math.max(z*2, 0x08), 0x19);

	// downcounts
	for (var i = 0; i < 8; ++i)
		rom[0x0BB88+i] = random.nextIntRange(0x9B, 0xA2+i);

	// # times you can hit PH when stunned
	rom[0x0AEA5] = random.nextIntRange(0x01, 0x0B); // jab
	rom[0x0BBAD] = random.nextIntRange(0x01, 0x0B); // uppercut
	rom[0x0BBA9] = random.nextIntRange(0x01, 0x0B); // hook

	// --------------------- DON FLAMENCO
	// blocking patterns (1&2)
	blockchance = 0.1 + random.nextFloat() * 0.7;
	rom[0x00B70] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x00B71] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x00B72] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x00B73] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012AF] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B0] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B1] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B2] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B5] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B6] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B7] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012B8] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012BB] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012BC] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012C1] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012C2] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012C3] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x012C4] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// opponent downtime
	for (var i = 0x01513; i <= 0x0151A; ++i)
		rom[i] = random.nextIntRange(0x9A, 0xA4);

	// down time after special (ko twice before 1:00 and not hit)
	rom[0x17E12] = random.nextIntRange(0x9A, 0xA4);

	// attack patterns
	rom[0x01796] = random.nextIntRange(0x95, 0x99);
	rom[0x017A1] = random.nextIntRange(0x95, 0x99);
	rom[0x017A3] = random.nextIntRange(0x95, 0x99);
	rom[0x017A5] = random.nextIntRange(0x95, 0x99);
	rom[0x017AC] = random.nextIntRange(0x95, 0x99);

	// # of times opponent stunned
	rom[0x0159F] = random.nextIntRange(0x01, 0x03);
	rom[0x015A3] = random.nextIntRange(0x01, 0x07);

	// punch speed
	rom[0x0176A] = random.nextIntRange(0x01, 0x39);
	rom[0x01768] = random.nextIntRange(0x02, 0x10);
}

function randomizeDamage(random, rom)
{
	// --------------------- GLASS JOE
	rom[0x01359] = random.nextIntRange(0x00, 0x21); // damage to GJ from uppercut
	rom[0x17C1F] = random.nextIntRange(0x06, 0x20); // damage to opponent from uppercut (high, low)

	// health when GJ gets back up in each of 7 different situations
	for (var i = 0; i < 7; ++i) rom[0x013E0+i] = random.nextIntRange(0x03, 0x0D);

	// --------------------- VON KAISER
	for (var i = 0x052DF; i <= 0x052E7; ++i)
		rom[i] = (rom[i] & 0xF0) | random.nextIntRange(1,8);

	rom[0x05282] = random.nextIntRange(0x05, 0x51);
	rom[0x04B4E] = random.nextIntRange(0x09, Math.min(0x21, 0x61-rom[0x05282]));
	rom[0x0E0EC] = random.nextIntRange(0x01, 0x41);

	rom[0x17B73] = random.nextIntRange(0x01, 0x06);
	rom[0x05298] = random.nextIntRange(0x01, 0x06);
	rom[0x04BE8] = random.nextIntRange(0x01, 0x04);
	rom[0x052D9] = random.nextIntRange(0x01, 0x06);

	for (var i = 0x05326; i <= 0x0532B; ++i)
		rom[i] = random.nextIntRange(0x08, 0x0D);

	// --------------------- PISTON HONDA
	rom[0x0BB57] = random.nextIntRange(0x15, 0x41); // PH damage constant
	rom[0x0AE65] = random.nextIntRange(0x07, 0x21); // PH damage from jab
	rom[0x0AFA6] = random.nextIntRange(0x07, 0x21); // PH damage from hook
	rom[0x0B187] = random.nextIntRange(0x0F, 0x26); // PH damage from uppercut
	rom[0x0B0A1] = random.nextIntRange(0x04, 0x11); // PH damage from quick rt
	rom[0x0B115] = random.nextIntRange(0x04, 0x11); // PH damage from quick lt

	rom[0x17B73] = random.nextIntRange(0x01, 0x06); // head punch (left)
	rom[0x17A87] = random.nextIntRange(0x01, 0x06); // gut punch (left)
	rom[0x17AD3] = random.nextIntRange(0x01, 0x06); // head punch (right)
	rom[0x17A48] = random.nextIntRange(0x01, 0x06); // gut punch (right)

	// health after recovery
	for (var i = 0x0BC48; i <= 0x0BC4D; ++i)
		rom[i] = random.nextIntRange(0x07, 0x0D);

	// damage to PH for uppercut
	rom[0x0BB7B] = random.nextIntRange(0x01, 0x06);

	// --------------------- DON FLAMENCO
	for (var i = 0x0164B; i <= 0x01651; ++i)
		rom[i] = random.nextIntRange(0x03, 0x0D);

	for (var i = 0x01654; i <= 0x01659; ++i)
		rom[i] = random.nextIntRange(0x03, 0x0D);

	// damage from DF
	rom[0x00C03] = random.nextIntRange(0x07, 0x31);
	rom[0x00D16] = random.nextIntRange(0x07, 0x36);
	rom[0x00C85] = random.nextIntRange(0x07, 0x31);
	rom[0x014E2] = random.nextIntRange(0x07, 0x31);
}

function randomizeThreshold(random, rom)
{
	// --------------------- GLASS JOE
	rom[0x0134F] = random.nextInt( 2); // points in 10,000s
	rom[0x01350] = random.nextInt(10); // points in  1,000s
}
