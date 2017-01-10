var VERSION_STRING = 'v0.4';

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
	rom[0x0E7D2] = random.nextIntRange(2, 6);
	rom[0x0E80E] = rom[0x0E7D2] + 1;
}

function randomizeHearts(random, rom)
{
	// hearts lost when opponent lands punch on Mac
	rom[0x0E154] = random.nextIntRange(0x03, 0x05);

	// hearts lost when Mac blocks a punch
	rom[0x0E0E2] = random.nextIntRange(0x01, 0x03);

	// --------------------- GLASS JOE
	rom[0x0132C] = toBinaryCodedDecimal(random.nextIntRange(10, 21)); // start round 1
	rom[0x0132F] = toBinaryCodedDecimal(random.nextIntRange(10, 21)); // start round 2
	rom[0x01330] = toBinaryCodedDecimal(random.nextIntRange(10, 21)); // start round 3
	rom[0x0132D] = toBinaryCodedDecimal(random.nextIntRange( 8, 16)); // after running out and dodging
	rom[0x0132E] = toBinaryCodedDecimal(random.nextIntRange( 5, 10)); // after getting up from KO

	// --------------------- VON KAISER
	rom[0x05279] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0527A] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0527B] = toBinaryCodedDecimal(random.nextIntRange( 8, 16));
	rom[0x0527C] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0527D] = toBinaryCodedDecimal(random.nextIntRange( 8, 16));
	rom[0x0527E] = toBinaryCodedDecimal(random.nextIntRange( 5, 11));
	rom[0x0527F] = toBinaryCodedDecimal(random.nextIntRange(10, 21));

	// --------------------- PISTON HONDA
	rom[0x0BB4E] = toBinaryCodedDecimal(random.nextIntRange(25, 51));
	rom[0x0BB4F] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0BB50] = toBinaryCodedDecimal(random.nextIntRange( 5, 11));
	rom[0x0BB51] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0BB52] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0BB53] = toBinaryCodedDecimal(random.nextIntRange( 5, 11));
	rom[0x0BB54] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0BB55] = toBinaryCodedDecimal(random.nextIntRange(10, 21));
	rom[0x0BB56] = toBinaryCodedDecimal(random.nextIntRange( 5, 11));

	// --------------------- DON FLAMENCO
/*	rom[0x014D9] = toBinaryCodedDecimal(random.nextIntRange( 1,10));
	rom[0x014DA] = toBinaryCodedDecimal(random.nextIntRange( 1, 7));
	rom[0x014DB] = toBinaryCodedDecimal(random.nextIntRange( 1, 3));
	rom[0x014DC] = toBinaryCodedDecimal(random.nextIntRange( 1, 7));
	rom[0x014DD] = toBinaryCodedDecimal(random.nextIntRange( 1, 5));
*/
	// --------------------- KING HIPPO
	rom[0x02C64] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C65] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C66] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C67] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C68] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C69] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C6A] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C6B] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));
	rom[0x02C6C] = toBinaryCodedDecimal(random.nextIntRange( 5, 10));

	// --------------------- GREAT TIGER
	rom[0x053DF]
	rom[0x053E0]
	rom[0x053E1]
	rom[0x053E2]
	rom[0x053E3]
	rom[0x053E4]
	rom[0x053E5]
	rom[0x053E6]
	rom[0x053E7]
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

	// attack patterns (2)
	rom[0x0BDE6] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDE8] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDEA] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDEC] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDF1] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDF3] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BDFB] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE02] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE04] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE06] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE0A] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE0C] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE0E] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE10] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE12] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE16] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE18] = random.nextIntRange(0x95, 0x9E);
	rom[0x0BE1E] = random.nextIntRange(0x95, 0x9E);

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

	// downtime (2)
	rom[0x0BB28] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB29] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2E] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0BB2F] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x0BBB3] = random.nextIntRange(0x03, 0x0B);
	rom[0x0B0CC] = random.nextIntRange(0x03, 0x0B);
	rom[0x0BBB5] = random.nextIntRange(0x03, 0x0B);
	rom[0x0BBAF] = random.nextIntRange(0x03, 0x0B);

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
	rom[0x0176A] = random.nextIntRange(0x10, 0x39);
	rom[0x00D37] = random.nextIntRange(0x10, 0x69);
	rom[0x01768] = random.nextIntRange(0x02, 0x10);
	rom[0x01769] = random.nextIntRange(0x02, 0x10) << 4; // FIXME

	// --------------------- KING HIPPO
	// blocking patterns
	blockchance = 0.1 + random.nextFloat() * 0.7;
	rom[0x02839] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0283A] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0283B] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0283C] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0283D] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x02766] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x02767] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x02768] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x02769] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0276A] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// number of hits with pants down
	rom[0x02972] = random.nextIntRange(0x03, 0x10);

	// attack patterns
	var HIPPO_ATTACK_VALUES =
	[
		0x9A,
		0x99, 0x99, 0x99,
		0x98, 0x98, 0x98, 0x98, 0x98,
		0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97,
		0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96,
		0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95,
	];

	rom[0x02D6E] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D6F] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D70] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D71] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D72] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D73] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D74] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D75] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D79] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7A] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7B] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7C] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7D] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7E] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D7F] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D80] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D83] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D84] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D85] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D86] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D87] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D88] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D89] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D8A] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D8C] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D8D] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D8E] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D8F] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D90] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D91] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D92] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D93] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D96] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D97] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D98] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D99] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D9A] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D9B] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D9C] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02D9D] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA2] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA3] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA4] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA5] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA6] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA7] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA8] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DA9] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DAC] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DAD] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DAE] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DAF] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB0] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB1] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB2] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB3] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB6] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB7] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB8] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DB9] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DBA] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DBB] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DBC] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DBD] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC0] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC1] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC2] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC3] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC4] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC5] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC6] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DC7] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DCC] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DCE] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DD0] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DD2] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DD5] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DD7] = random.from(HIPPO_ATTACK_VALUES);
	rom[0x02DD9] = random.from(HIPPO_ATTACK_VALUES);

	// punch speed
	rom[0x02D5E] = random.nextIntRange(0x20, 0x39); // FIXME
	rom[0x02971] = random.nextIntRange(0x40, 0x80); // FIXME

	// --------------------- GREAT TIGER
	// attack patterns
	rom[0x0553E] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x0553F] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x05541] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x05546] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x0554A] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x0554C] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x0554F] = random.from([0x96, 0x8F, 0x97, 0x98]);
	rom[0x05555] = random.from([0x96, 0x8F, 0x97, 0x98]);
//	rom[0x05559] = random.from([0x96, 0x8F, 0x97, 0x98]);

	// downtime values
	rom[0x05419] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541E] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0541F] = random.nextIntRange(0x9A, 0xA4);
	rom[0x05420] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x0543E] = random.nextIntRange(0x03, 0x0B);
	rom[0x04BDC] = random.nextIntRange(0x03, 0x0B);
	rom[0x04BFD] = random.nextIntRange(0x03, 0x0B);
	rom[0x05440] = random.nextIntRange(0x03, 0x0B);

	// punch speed
	rom[0x0552F] = random.nextIntRange(0x10, 0x31);
	rom[0x04BFC] = random.nextIntRange(0x10, 0x31);
	rom[0x04DBD] = random.nextIntRange(0x10, 0x21);

	// time when special occurs
	rom[0x054E9]
	rom[0x054F2]
	rom[0x05501]
	rom[0x0550A]
	rom[0x0550E]
	rom[0x05519]
	rom[0x0551D]

	// --------------------- BALD BULL 1
	var BBULL_ATTACK_VALUES =
	[
		0x99, 0x99,
		0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97,
		0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96, 0x96,
		0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95,
	];

	rom[0x07C6D] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CDF] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C77] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C79] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C7F] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C81] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C8C] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C8E] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07C90] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CA0] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CA2] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CA4] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CAA] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CB1] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CB3] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CB5] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CB7] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CB9] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CC1] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CC3] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CC9] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CCB] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CCD] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CD1] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CD8] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CDC] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CDE] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CE0] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CF0] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CF6] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CFA] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07CFE] = random.from(BBULL_ATTACK_VALUES);
	rom[0x07D00] = random.from(BBULL_ATTACK_VALUES);

	// down time
	rom[0x07927] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07928] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07929] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0792A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0792B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0792C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0792D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0792E] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x070F2] = random.nextIntRange(0x03, 0x0B);
	rom[0x079A8] = random.nextIntRange(0x03, 0x0B);
	rom[0x079AC] = random.nextIntRange(0x03, 0x0B);

	// --------------------- SODA POPINSKI
	// block chance (with SUPER MACHO MAN)
	blockchance = 0.1 + random.nextFloat() * 0.7;
	rom[0x09831] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09832] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09833] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09834] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09837] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09838] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09839] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0983A] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0983D] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0983E] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x0983F] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09840] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09843] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09844] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09845] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x09846] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// attack pattern
	rom[0x09B9A] = random.nextIntRange(0x95, 0x9B);
	rom[0x09B9C] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BA6] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BA8] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BAE] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BB2] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BB4] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BB6] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BB8] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BBA] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BBC] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BC4] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BC8] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BCA] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BD6] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BD8] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BDF] = random.nextIntRange(0x95, 0x9B);
	rom[0x09BE1] = random.nextIntRange(0x95, 0x9B);

	// downcounts
	rom[0x09A9C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09A9D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09A9E] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09A9F] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09AA0] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09AA1] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09AA2] = random.nextIntRange(0x9A, 0xA4);
	rom[0x09AA3] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x09ABF] = random.nextIntRange(0x03, 0x0B);
	rom[0x09AC5] = random.nextIntRange(0x03, 0x0B);
	rom[0x09ABD] = random.nextIntRange(0x03, 0x0B);
	rom[0x0918C] = random.nextIntRange(0x03, 0x0B);

	// --------------------- BALD BULL 2
	// block chance
	blockchance = 0.1 + random.nextFloat() * 0.7;
	rom[0x077F0] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F1] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F2] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F3] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F6] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F7] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F8] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077F9] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077FC] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077FD] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077FE] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x077FF] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x07802] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x07803] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x07804] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x07805] = random.flipCoin(blockchance) ? 0x08 : 0x00;
	rom[0x07CB1] = random.flipCoin(blockchance) ? 0x08 : 0x00;

	// attack patterns
	rom[0x07CB1] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CB3] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CB5] = random.nextIntRange(0x95, 0x9A);
	rom[0x07BC7] = random.nextIntRange(0x95, 0x9A);
	rom[0x07BC9] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CC1] = random.nextIntRange(0x95, 0x9A);
	rom[0x07BC3] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CC9] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CCB] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CBD] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CD1] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CD8] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CDC] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CDE] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CE0] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CF0] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CF6] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CFA] = random.nextIntRange(0x95, 0x9A);
	rom[0x07CFE] = random.nextIntRange(0x95, 0x9A);
	rom[0x07D00] = random.nextIntRange(0x95, 0x9A);

	// downcounts
	rom[0x07987] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07988] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07989] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0798A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0798B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0798C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0798D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0798E] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x070F2] = random.nextIntRange(0x03, 0x0A);
	rom[0x079B2] = random.nextIntRange(0x03, 0x0A);
	rom[0x079B6] = random.nextIntRange(0x03, 0x0A);
	rom[0x079B8] = random.nextIntRange(0x03, 0x0A);

	// --------------------- DON FLAMENCO 2
	// downcounts
	rom[0x01573] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01574] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01575] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01576] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01577] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01578] = random.nextIntRange(0x9A, 0xA4);
	rom[0x01579] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0157A] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x00C25] = random.nextIntRange(0x03, 0x0B);
	rom[0x015A9] = random.nextIntRange(0x03, 0x0B);
	rom[0x015AB] = random.nextIntRange(0x03, 0x0B);
	rom[0x015B1] = random.nextIntRange(0x03, 0x0B);

	// --------------------- MR. SANDMAN
	rom[0x07E67] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E6B] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E6F] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E73] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E77] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E81] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E87] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E89] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E91] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E93] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E95] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E97] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E9D] = random.nextIntRange(0x95, 0xA0);
	rom[0x07E9F] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EA6] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EA8] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EB4] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EBA] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EC0] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EC3] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EC5] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EC7] = random.nextIntRange(0x95, 0xA0);
	rom[0x07ED5] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EDB] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EE1] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EE4] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EE6] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EEC] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EF8] = random.nextIntRange(0x95, 0xA0);
	rom[0x07EFE] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F00] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F02] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F04] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F09] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F0B] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F10] = random.nextIntRange(0x95, 0xA0);
	rom[0x07F12] = random.nextIntRange(0x95, 0xA0);

	// downcounts
	rom[0x07D45] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D46] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D47] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D48] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D49] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D4A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D4B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x07D4C] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x070E6] = random.nextIntRange(0x03, 0x0B);
	rom[0x0704C] = random.nextIntRange(0x03, 0x0B);
	rom[0x070F2] = random.nextIntRange(0x03, 0x0B);
	rom[0x07D66] = random.nextIntRange(0x03, 0x0B);

	// --------------------- SUPER MACHO MAN
	var MACHO_ATTACK_VALUES =
	[
		0x9B, 0x9B,
		0x98, 0x98, 0x98, 0x98, 0x98, 0x98, 0x98, 0x98, 0x98, 0x98, 0x98,
		0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97, 0x97,
		0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95,
	];

	rom[0x099C8] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099C9] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CA] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CB] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CC] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CD] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CE] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099CF] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D1] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D2] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D3] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D4] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D5] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D6] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D7] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099D8] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DA] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DB] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DC] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DD] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DE] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099DF] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099E0] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099E1] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099E5] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099E7] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099FD] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099FE] = random.from(MACHO_ATTACK_VALUES);
	rom[0x099FF] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A00] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A01] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A02] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A03] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A04] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A06] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A06] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A08] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A09] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A0A] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A0B] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A0C] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A0D] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A10] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A11] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A12] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A13] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A14] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A15] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A16] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A17] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A27] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A28] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A29] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A2A] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A2B] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A2C] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A2D] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A2E] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A30] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A31] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A32] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A33] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A34] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A35] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A36] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A37] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A39] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3A] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3B] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3C] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3D] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3E] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A3F] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A40] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A46] = random.from(MACHO_ATTACK_VALUES);
	rom[0x09A48] = random.from(MACHO_ATTACK_VALUES);

	// downcounts
	rom[0x098C8] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098C9] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CA] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CB] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CC] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CD] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CE] = random.nextIntRange(0x9A, 0xA4);
	rom[0x098CF] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x098EB] = random.nextIntRange(0x03, 0x0A);
	rom[0x098E9] = random.nextIntRange(0x03, 0x0A);

	// --------------------- TYSON
	// hit patterns
	var TYSON_ATTACK_VALUES = [0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9C, 0x9D];
	rom[0x0B9B5] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9BA] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9C1] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9C3] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9C8] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9CA] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9DC] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9E3] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9E5] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9ED] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9EF] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9F6] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0B9FB] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA08] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA09] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0C] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0E] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA0F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA11] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA12] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA13] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA14] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA15] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA16] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA17] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA18] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1C] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1E] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA1F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA20] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA21] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA28] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA2A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA2F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA30] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA31] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA32] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA33] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA34] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA35] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA36] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4C] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4E] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA4F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA50] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA51] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA53] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA54] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA55] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA56] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA57] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA58] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA59] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA5A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA64] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA65] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA66] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA67] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA68] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA69] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA6A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA6B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA6F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA71] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA77] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA78] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA79] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA7A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA7B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA7C] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA7D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA7E] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA80] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA81] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA82] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA83] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA84] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA85] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA86] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA87] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8A] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8C] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8E] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA8F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA90] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA91] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA97] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA99] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA9B] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA9D] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BA9F] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BAA3] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BAA5] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BAB6] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BABA] = random.from(TYSON_ATTACK_VALUES);
	rom[0x0BAC4] = random.from(TYSON_ATTACK_VALUES);

	// downcounts
	rom[0x0B859] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85A] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85B] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85C] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85D] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85E] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B85F] = random.nextIntRange(0x9A, 0xA4);
	rom[0x0B860] = random.nextIntRange(0x9A, 0xA4);

	// # hits when stunned
	rom[0x0B87F] = random.nextIntRange(0x03, 0x0B);
	rom[0x0AF76] = random.nextIntRange(0x03, 0x0B);
	rom[0x0AF24] = random.nextIntRange(0x03, 0x0B);
}

function randomizeDamage(random, rom)
{
	return; // FIXME

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

	// health after recovery (1)
	for (var i = 0x0BC48; i <= 0x0BC4D; ++i)
		rom[i] = random.nextIntRange(0x07, 0x0D);

	// damage to PH for uppercut
	rom[0x0BB7B] = random.nextIntRange(0x01, 0x06);

	// opp health when gets back up (2)
	rom[0x0BC78] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC79] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC7A] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC7B] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC7C] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC7D] = random.nextIntRange(0x03, 0x0D);

	// ??
	rom[0x0BC80] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC81] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC82] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC83] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC84] = random.nextIntRange(0x03, 0x0D);
	rom[0x0BC85] = random.nextIntRange(0x03, 0x0D);

	// --------------------- DON FLAMENCO
	for (var i = 0x0164B; i <= 0x01651; ++i)
		rom[i] = random.nextIntRange(0x03, 0x0D);

	for (var i = 0x01654; i <= 0x01659; ++i)
		rom[i] = random.nextIntRange(0x03, 0x0D);

	// damage from DF
	rom[0x00C03] = random.nextIntRange(0x07, 0x31);
	rom[0x00D16] = random.nextIntRange(0x07, 0x36);
	rom[0x00C85] = random.nextIntRange(0x07, 0x18);
	rom[0x014E2] = random.nextIntRange(0x07, 0x31);

	// --------------------- KING HIPPO
	rom[0x029E4] = random.nextIntRange(0x1C, 0x2B);
	rom[0x02C6D] = random.nextIntRange(0x14, 0x21);
	rom[0x02929] = random.nextIntRange(0x07, 0x21);
	rom[0x028EE] = random.nextIntRange(0x07, 0x21);

	// --------------------- GREAT TIGER
	rom[0x04BBA] = random.nextIntRange(0x04, 0x21);
	rom[0x04B4E] = random.nextIntRange(0x09, 0x36);
	rom[0x04B09] = random.nextIntRange(0x09, 0x36);
	rom[0x053E8] = random.nextIntRange(0x06, 0x26);
	rom[0x0516A] = random.nextIntRange(0x07, 0x36);

	// opp health when gets back up
	rom[0x0548D] = random.nextIntRange(0x03, 0x0D);
	rom[0x0548E] = random.nextIntRange(0x03, 0x0D);
	rom[0x0548F] = random.nextIntRange(0x03, 0x0D);
	rom[0x05490] = random.nextIntRange(0x03, 0x0D);
	rom[0x05491] = random.nextIntRange(0x03, 0x0D);
	rom[0x05492] = random.nextIntRange(0x03, 0x0D);
	rom[0x05495] = random.nextIntRange(0x03, 0x0D);
	rom[0x05496] = random.nextIntRange(0x03, 0x0D);
	rom[0x05497] = random.nextIntRange(0x03, 0x0D);
	rom[0x05498] = random.nextIntRange(0x03, 0x0D);
	rom[0x05499] = random.nextIntRange(0x03, 0x0D);
	rom[0x0549A] = random.nextIntRange(0x03, 0x0D);

	// --------------------- BALD BULL 1
	// opp health when gets back up
	rom[0x07A11] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A12] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A13] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A14] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A15] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A16] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x07A19] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A1A] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A1B] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A1C] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A1D] = random.nextIntRange(0x03, 0x0D);
	rom[0x07A1E] = random.nextIntRange(0x03, 0x0D);

	// --------------------- SODA POPINSKI
	// opp health when gets back up
	rom[0x09AF2] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AF3] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AF4] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AF5] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AF6] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AF7] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x09AFA] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AFB] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AFC] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AFD] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AFE] = random.nextIntRange(0x03, 0x0D);
	rom[0x09AFF] = random.nextIntRange(0x03, 0x0D);

	// --------------------- BALD BULL 2
	// opp health when gets back up
	rom[0x09A31] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A32] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A33] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A34] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A35] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A36] = random.nextIntRange(0x93, 0x9D);

	// ???
	rom[0x09A39] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A3A] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A3B] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A3C] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A3D] = random.nextIntRange(0x93, 0x9D);
	rom[0x09A3E] = random.nextIntRange(0x93, 0x9D);

	// --------------------- DON FLAMENCO 2
	// opp health when gets back up
	rom[0x0167C] = random.nextIntRange(0x03, 0x0D);
	rom[0x0167D] = random.nextIntRange(0x03, 0x0D);
	rom[0x0167E] = random.nextIntRange(0x03, 0x0D);
	rom[0x0167F] = random.nextIntRange(0x03, 0x0D);
	rom[0x01680] = random.nextIntRange(0x03, 0x0D);
	rom[0x01681] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x01684] = random.nextIntRange(0x03, 0x0D);
	rom[0x01685] = random.nextIntRange(0x03, 0x0D);
	rom[0x01686] = random.nextIntRange(0x03, 0x0D);
	rom[0x01687] = random.nextIntRange(0x03, 0x0D);
	rom[0x01688] = random.nextIntRange(0x03, 0x0D);
	rom[0x01689] = random.nextIntRange(0x03, 0x0D);

	// --------------------- SUPER MACHO MAN
	// opp health when gets back up
	rom[0x07D9B] = random.nextIntRange(0x03, 0x0D);
	rom[0x07D9C] = random.nextIntRange(0x03, 0x0D);
	rom[0x07D9D] = random.nextIntRange(0x03, 0x0D);
	rom[0x07D9E] = random.nextIntRange(0x03, 0x0D);
	rom[0x07D9F] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA0] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x07DA3] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA4] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA5] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA6] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA7] = random.nextIntRange(0x03, 0x0D);
	rom[0x07DA8] = random.nextIntRange(0x03, 0x0D);

	// --------------------- SUPER MACHO MAN
	// opp health when gets back up
	rom[0x0991B] = random.nextIntRange(0x03, 0x0D);
	rom[0x0991C] = random.nextIntRange(0x03, 0x0D);
	rom[0x0991D] = random.nextIntRange(0x03, 0x0D);
	rom[0x0991E] = random.nextIntRange(0x03, 0x0D);
	rom[0x0991F] = random.nextIntRange(0x03, 0x0D);
	rom[0x09920] = random.nextIntRange(0x03, 0x0D);
	rom[0x09921] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x09924] = random.nextIntRange(0x03, 0x0D);
	rom[0x09925] = random.nextIntRange(0x03, 0x0D);
	rom[0x09926] = random.nextIntRange(0x03, 0x0D);
	rom[0x09927] = random.nextIntRange(0x03, 0x0D);
	rom[0x09928] = random.nextIntRange(0x03, 0x0D);
	rom[0x09929] = random.nextIntRange(0x03, 0x0D);

	// --------------------- TYSON
	// opp health when gets back up
	rom[0x0B8D5] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8D6] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8D7] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8D8] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8D9] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8DA] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8DB] = random.nextIntRange(0x03, 0x0D);

	// ???
	rom[0x0B8DE] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8DF] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8E0] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8E1] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8E2] = random.nextIntRange(0x03, 0x0D);
	rom[0x0B8E3] = random.nextIntRange(0x03, 0x0D);
}

function randomizeThreshold(random, rom)
{
	// --------------------- GLASS JOE
	rom[0x0134F] = random.nextInt( 2); // points in 10,000s
	rom[0x01350] = random.nextInt(10); // points in  1,000s
}
