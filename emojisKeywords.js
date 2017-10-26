/* */

//http://unicode.org/emoji/charts/full-emoji-list.html
	
let ALL_KEYWORDS = [
	[
		['grinning face', 'grin', 'face'],
		['grinning face with smiling eyes', 'eye', 'face', 'grin', 'smile'],
		['face with tears of joy', 'face', 'joy', 'laugh', 'tear'],
		['rolling on the floor laughing', 'face', 'floor', 'laugh', 'rolling'],
		['smiling face with open mouth', 'face', 'mouth', 'open', 'smile'],
		['smiling face with open mouth & smiling eyes', 'eye', 'face', 'mouth', 'open', 'smile'],
		['smiling face with open mouth & cold sweat', 'cold', 'face', 'open', 'smile', 'sweat'],
		['smiling face with open mouth & closed eyes', 'face', 'laugh', 'mouth', 'open', 'satisfied', 'smile'],
		['winking face', 'face', 'wink'],
		['smiling face with smiling eyes', 'blush', 'eye', 'face', 'smile'],
		//-------------
		['face savouring delicious food', 'delicious', 'face', 'savouring', 'smile', 'um', 'yum'],
		['smiling face with sunglasses', 'bright', 'cool', 'eye', 'eyewear', 'face', 'glasses', 'smile', 'sun', 'sunglasses'],
		['smiling face with heart-eyes', 'eye', 'face', 'love', 'heart', 'smile'],
		['face blowing a kiss', 'face', 'kiss'],
		['kissing face', 'face', 'kiss'],
		['kissing face with smiling eyes', 'eye', 'face', 'kiss', 'smile'],
		['kissing face with closed eyes', 'closed', 'eye', 'face', 'kiss'],
		['smiling face', 'face', 'outlined', 'relaxed', 'smile'],
		['slightly smiling face', 'face', 'smile'],
		['hugging face', 'face', 'hug', 'hugging'],
		//-------------
		['star-struck', 'eyes', 'face', 'grinning', 'star', 'starry-eyed'],
		['thinking face', 'face', 'thinking'],
		['face with raised eyebrow', 'distrust', 'skeptic', 'disapproval', 'disbelief', 'mild surprise', 'scepticism'],
		['neutral face', 'deadpan', 'face', 'neutral'],
		['expressionless face', 'expressionless', 'face', 'inexpressive', 'unexpressive'],
		['face without mouth', 'face', 'mouth', 'quiet', 'silent'],
		['face with rolling eyes', 'eyes', 'face', 'rolling'],
		['smirking face', 'face', 'smirk'],
		['persevering face', 'face', 'persevere'],
		['disappointed but relieved face', 'disappointed', 'face', 'relieved', 'whew'],
		//-------------
		['face with open mouth', 'face', 'mouth', 'open', 'sympathy'],
		['zipper-mouth face', 'face', 'mouth', 'zipper'],
		['hushed face', 'face', 'hushed', 'stunned', 'surprised'],
		['sleepy face', 'face', 'sleep'],
		['tired face', 'face', 'tired'],
		['sleeping face', 'face', 'sleep', 'zzz'],
		['relieved face', 'face', 'relieved'],
		['face with stuck-out tongue', 'face', 'tongue'],
		['face with stuck-out tongue & winking eye', 'eye', 'face', 'joke', 'tongue', 'wink'],
		['face with stuck-out tongue & closed eyes', 'eye', 'face', 'horrible', 'taste', 'tongue'],
		//-------------
		['drooling face', 'drooling', 'face'],
		['unamused face', 'face', 'unamused', 'unhappy'],
		['face with cold sweat', 'cold', 'face', 'sweat'],
		['pensive face', 'dejected', 'face', 'pensive'],
		['confused face	', 'confused', 'face'],
		['upside-down face', 'face', 'upside-down'],
		['money-mouth face', 'face', 'money', 'mouth'],
		['astonished face', 'astonished', 'face', 'shocked', 'totally'],
		['frowning face', 'face', 'frown'],
		['slightly frowning face', 'face', 'frown'],
		//-------------
		['confounded face', 'confounded', 'face'],
		['disappointed face', 'disappointed', 'face'],
		['worried face', 'face', 'worried'],
		['face with steam from nose', 'face', 'triumph', 'won'],
		['crying face', 'cry', 'face', 'sad', 'tear'],
		['loudly crying face', 'cry', 'face', 'sad', 'sob', 'tear'],
		['frowning face with open mouth', 'face', 'frown', 'mouth', 'open'],
		['anguished face', 'anguished', 'face'],
		['fearful face', 'face', 'fear', 'fearful', 'scared'],
		['weary face', 'face', 'tired', 'weary'],
		//-------------
		['exploding head', 'shocked'],
		['grimacing face', 'face', 'grimace'],
		['face with open mouth & cold sweat', 'blue', 'cold', 'face', 'mouth', 'open', 'rushed', 'sweat'],
		['face screaming in fear', 'face', 'fear', 'fearful', 'munch', 'scared', 'scream'],
		['flushed face', 'dazed', 'face', 'flushed'],
		['crazy face', 'eye', 'large', 'small'],
		['dizzy face', 'dizzy', 'face'],
		['pouting face', 'angry', 'face', 'mad', 'pouting', 'rage', 'red'],
		['angry face', 'angry', 'face', 'mad'],
		['face with symbols over mouth', 'cursing'],
		//-------------
		['face with medical mask', 'cold', 'doctor', 'face', 'mask', 'medicine', 'sick'],
		['face with thermometer', 'face', 'ill', 'sick', 'thermometer'],
		['face with head-bandage', 'bandage', 'face', 'hurt', 'injury'],
		['nauseated face', 'face', 'nauseated', 'vomit'],
		['face vomiting', 'sick', 'vomit'],
		['sneezing face', '	face', 'sneeze'],
		['smiling face with halo', 'angel', 'face', 'fairy tale', 'fantasy', 'halo', 'innocent', 'smile'],
		['cowboy hat face', 'cowboy', 'cowgirl', 'face', 'hat'],
		['clown face', 'clown', 'face'],
		['lying face', 'face', 'lie', 'pinocchio'],
		//-------------		
		['shushing face', 'shush', 'face'],
		['face with hand over mouth', 'whoops', 'shock', 'sudden realization', 'surprise'],
		['face with monocle', 'stuffy', 'wealthy'],
		['nerd face', 'face', 'geek', 'nerd'],
		['smiling face with horns', 'face', 'fairy tale', 'fantasy', 'horns', 'smile'],
		['angry face with horns', 'demon', 'devil', 'face', 'fairy tale', 'fantasy', 'imp'],
		['ogre', 'creature', 'face', 'fairy tale', 'fantasy', 'monster', 'troll'],
		['goblin', 'creature', 'face', 'fairy tale', 'fantasy', 'monster'],
		['skull', 'death', 'face', 'fairy tale', 'monster'],
		['skull and crossbones', 'crossbones', 'death', 'face', 'monster', 'skull'],
		//-------------
		['ghost', 'creature', 'face', 'fairy tale', 'fantasy', 'monster'],
		['alien', 'creature', 'extraterrestrial', 'face', 'fairy tale', 'fantasy', 'monster', 'ufo'],
		['alien monster', 'alien', 'creature', 'extraterrestrial', 'face', 'fairy tale', 'fantasy', 'monster', 'ufo'],
		['robot face', 'face', 'monster', 'robot'],
		['pile of poo', 'comic', 'dung', 'face', 'monster', 'poo', 'poop'],
		['smiling cat face with open mouth', 'cat', 'face', 'mouth', 'open', 'smile'],
		['grinning cat face with smiling eyes', 'cat', 'eye', 'face', 'grin', 'smile'],
		['cat face with tears of joy', 'cat', 'face', 'joy', 'tear'],
		['smiling cat face with heart-eyes', 'cat', 'eye', 'face', 'love', 'smile'],
		['cat face with wry smile', 'cat', 'face', 'ironic', 'smile', 'wry'],
		//-------------
		['kissing cat face with closed eyes', 'cat', 'eye', 'face', 'kiss'],
		['weary cat face', 'cat', 'face', 'oh', 'surprised', 'weary'],
		['crying cat face', 'cat', 'cry', 'face', 'sad', 'tear'],
		['pouting cat face', 'cat', 'face', 'pouting'],
		['see-no-evil monkey', 'evil', 'face', 'forbidden', 'gesture', 'monkey', 'no', 'not', 'prohibited', 'see'],
		['hear-no-evil monkey', 'evil', 'face', 'forbidden', 'gesture', 'hear', 'monkey', 'no', 'not', 'prohibited'],
		['speak-no-evil monkey', 'evil', 'face', 'forbidden', 'gesture', 'monkey', 'no', 'not', 'prohibited', 'speak'],
		['baby', 'baby', 'young'],
		['boy', 'boy', 'young'],
		['girl', 'Virgo', 'young', 'zodiac'],
		//-------------
		['man', 'man'],
		['woman', 'woman'],
		['old man', 'man', 'old'],
		['old woman', 'old', 'woman'],
		//['man health worker', 'doctor', 'healthcare', 'man', 'nurse', 'therapist'],
		['police officer', 'cop', 'officer', 'police'],
		['detective', 'detective', 'sleuth', 'spy'],
		['guard', 'guard'],
		['construction worker', 'construction', 'hat', 'worker'],
		['prince'],
		//-------------
		['princess', 'fairy tale', 'fantasy'],
		['person wearing turban', 'turban'],
		['man with Chinese cap', 'gua pi mao', 'hat', 'man', 'chinese'],
		['woman with headscarf', 'headscarf', 'hijab', 'mantilla', 'tichel', 'bandana', 'head kerchief'],
		['blond-haired person', 'blond'],
		['man in tuxedo', 'groom', 'man', 'tuxedo'],
		['bride with veil', 'bride', 'veil', 'wedding'],
		['pregnant woman', 'pregnant', 'woman'],
		['baby angel', 'angel', 'baby', 'face', 'fairy tale', 'fantasy'],
		['Santa Claus', 'Christmas', 'celebration', 'claus', 'father', 'santa'],
		//-------------
		['Mrs. Claus', 'Christmas', 'Mrs.', 'celebration', 'claus', 'mother'],
		['person frowning', 'frown', 'gesture'],
		['person pouting', 'gesture', 'pouting'],
		['person gesturing NO', 'forbidden', 'gesture', 'hand', 'no', 'not', 'prohibited'],
		['person gesturing OK', 'OK', 'ok', 'gesture', 'hand'],
		['person tipping hand', 'hand', 'help', 'information', 'sassy', 'tipping'],
		['person raising hand', 'gesture', 'hand', 'happy', 'raised'],
		['person bowing', 'apology', 'bow', 'gesture', 'sorry'],
		['person facepalming', 'disbelief', 'exasperation', 'face', 'palm'],
		['person shrugging', 'doubt', 'ignorance', 'indifference', 'shrug'],
		//-------------
		['person getting massage', 'face', 'massage', 'salon'],
		['person getting haircut', 'barber', 'beauty', 'haircut', 'parlor'],
		['person walking', 'hike', 'walk', 'walking'],
		['person running', 'marathon', 'running'],
		['woman dancing', 'dancing', 'woman'],
		['man dancing', 'dance', 'man'],
		['people with bunny ears partying', 'bunny ear', 'dancer', 'partying'],
		['person taking bath', 'bath', 'bathtub'],
		['person in bed', 'hotel', 'sleep', 'bed'],
		['man in business suit levitating', 'business', 'man', 'suit'],
		//-------------
		['speaking head', 'face', 'head', 'silhouette', 'speak', 'speaking'],
		['bust in silhouette', 'bust', 'silhouette'],
		['busts in silhouette', 'bust', 'silhouette'],
	//-----family
		['man and woman holding hands', 'couple', 'hand', 'hold', 'man', 'woman'],
		['two men holding hands', 'Gemini', 'couple', 'hand', 'hold', 'man', 'twins', 'zodiac'],
		['two women holding hands', 'couple', 'hand', 'hold', 'woman'],
		['kiss', 'couple'],
		['couple with heart', 'couple', 'love'],
		['family'],
	//-----body
		['selfie', 'camera', 'phone', 'selfie'],
		['flexed biceps', 'biceps', 'comic', 'flex', 'muscle'],
		
		//-------------
		
		['backhand index pointing left', 'backhand', 'finger', 'hand', 'index', 'point'],
		['backhand index pointing right', 'backhand', 'finger', 'hand', 'index', 'point'],
		['index pointing up', 'finger', 'hand', 'index', 'point', 'up'],
		['backhand index pointing up', 'backhand', 'finger', 'hand', 'index', 'point', 'up'],
		['middle finger', 'finger', 'hand'],
		['backhand index pointing down', 'backhand', 'down', 'finger', 'hand', 'index', 'point'],
		['victory hand', 'hand', 'v', 'victory'],
		['crossed fingers', 'cross', 'finger', 'hand', 'luck'],
		['vulcan salute', 'finger', 'hand', 'spock', 'vulcan'],
		['sign of the horns', 'finger', 'hand', 'horns', 'rock-on'],
		//-------------
		['call me hand', 'call', 'hand'],
		['raised hand with fingers splayed', 'finger', 'hand', 'splayed'],
		['raised hand', 'hand'],
		['OK hand', 'ok', 'OK', 'hand'],
		['thumbs up', '+1', 'hand', 'thumb', 'up'],
		['thumbs down', '-1', 'down', 'hand', 'thumb'],
		['raised fist', 'clenched', 'fist', 'hand', 'punch'],
		['oncoming fist', 'clenched', 'fist', 'hand', 'punch'],
		['left-facing fist', 'fist', 'leftwards'],
		['right-facing fist', 'fist', 'rightwards'],
		
		//-------------
		['raised back of hand', 'backhand', 'raised'],
		['waving hand', 'hand', 'wave', 'waving'],
		['writing hand', 'hand', 'write'],
		['clapping hands', 'clap', 'hand'],
		['open hands', 'hand', 'open'],
		['raising hands', 'celebration', 'gesture', 'hand', 'hooray', 'raised'],
		['folded hands', 'ask', 'bow', 'folded', 'gesture', 'hand', 'please', 'pray', 'thanks'],
		['handshake', 'agreement', 'hand', 'handshake', 'meeting', 'shake'],
		['nail polish', 'care', 'cosmetics', 'manicure', 'nail', 'polish'],
		['ear', 'body'],
		//-------------
		['nose', 'body'],
		['footprints', 'clothing', 'footprint', 'print', 'gnome'],
		['eyes', 'eye', 'face'],
		['eye', 'face', 'body'],
		['eye in speech bubble', 'eye', 'speech bubble', 'witness'],
		['tongue', 'body'],
		['mouth', 'lips'],
	
	//clothing
		['glasses', 'clothing', 'eye', 'eyeglasses', 'eyewear'],
		['sunglasses', 'dark', 'eye', 'sun', 'eyewear', 'glasses'],
		['necktie', 'clothing'],
		//-------------
		['t-shirt', 'clothing', 'shirt', 'tshirt'],
		['jeans', 'clothing', 'pants', 'trousers'],
		['dress', 'clothing'],
		['kimono', 'clothing'],
		['bikini', 'clothing', 'swim'],
		['woman’s clothes', 'clothing', 'woman'],
		['purse', 'clothing', 'coin'],
		['handbag', 'bag', 'clothing', 'purse'],
		['clutch bag', 'bag', 'clothing', 'pouch'],
		['shopping bags', 'bag', 'hotel', 'shopping'],
		//-------------
		['school backpack', 'bag', 'satchel', 'school'],
		['man’s shoe', 'clothing', 'man', 'shoe'],
		['running shoe', 'athletic', 'clothing', 'shoe', 'sneaker'],
		['high-heeled shoe', 'clothing', 'heel', 'shoe', 'woman'],
		['woman’s sandal', 'clothing', 'sandal', 'shoe', 'woman'],
		['woman’s boot', 'boot', 'clothing', 'shoe', 'woman'],
		['crown', 'clothing', 'king', 'queen'],
		['woman’s hat', 'clothing', 'hat', 'woman'],
		['top hat', 'clothing', 'hat', 'top', 'tophat'],
		['graduation cap', 'cap', 'celebration', 'clothing', 'graduation', 'hat'],
		//-------------
		['rescue worker’s helmet', 'aid', 'cross', 'face', 'hat', 'helmet'],
		['prayer beads', 'beads', 'clothing', 'necklace', 'prayer', 'religion'],
		['lipstick', 'cosmetics', 'makeup'],
		['ring', 'diamond'],
		['gem stone', 'diamond', 'gem', 'jewel']
	], [	//animals
		['monkey face', 'face', 'monkey'],
		['monkey', 'monkey'],
		['gorilla', 'gorilla', 'monkey'],
		['dog face', 'dog', 'face', 'pet'],
		['dog', 'pet'],
		//-------------
		['poodle', 'dog'],
		['wolf face', 'face', 'wolf'],
		['fox face', 'face', 'fox'],
		['cat face', 'cat', 'face', 'pet'],
		['cat', 'pet', 'feline'],
		['lion face', 'Leo', 'face', 'lion', 'zodiac'],
		['tiger face', 'face', 'tiger'],
		['tiger', 'feline'],
		['leopard', 'feline'],
		['horse face', 'face', 'horse'],
		//-------------
		['horse', 'equestrian', 'racehorse', 'racing'],
		['unicorn face', 'face', 'unicorn', 'fantasy'],
		['zebra'],
		['deer'],
		['cow face', 'cow', 'face'],
		['ox', 'Taurus', 'bull', 'zodiac'],
		['water buffalo', 'buffalo', 'water'],
		['cow'],
		['pig face', 'face', 'pig'],
		['pig', 'sow'],
		//-------------
		['boar', 'pig'],
		['pig nose', 'face', 'nose', 'pig'],
		['ram', 'Aries', 'male', 'sheep', 'zodiac'],
		['ewe', 'female', 'sheep'],
		['goat', 'Capricorn', 'zodiac', 'GEGL'],
		['camel', 'dromedary', 'hump'],
		['two-hump camel', 'bactrian', 'camel', 'hump'],
		['giraffe'],
		['elephant'],
		['rhinoceros'],
		//-------------
		['mouse face', 'face', 'mouse'],
		['mouse'],
		['rat'],
		['hamster face', 'face', 'hamster', 'pet'],
		['rabbit face', 'bunny', 'face', 'pet', 'rabbit'],
		['rabbit', 'bunny', 'pet'],
		['chipmunk'],
		['hedgehog'],
		['bat', 'bat', 'vampire'],
		['bear face', 'bear', 'face'],
		
		//-------------
		
		['koala'],
		['panda face', 'face', 'panda'],
		['paw prints', 'feet', 'paw', 'print'],
		['turkey', 'bird'],
		['chicken', 'bird'],
		['rooster', 'bird'],
		['hatching chick', 'baby', 'bird', 'chick', 'hatching'],
		['baby chick', 'baby', 'bird', 'chick'],
		['front-facing baby chick', 'baby', 'bird', 'chick'],
		['bird'],
		
		//-------------
		
		['penguin', 'bird', 'tux', 'linux'],
		['dove', 'bird', 'fly', 'peace'],
		['eagle', 'bird'],
		['duck', 'bird'],
		['owl', 'bird', 'owl', 'wise'],
		['frog face', 'face', 'frog'],
		['crocodile', 'alligator'],
		['turtle', 'terrapin', 'tortoise', 'turtle'],
		['lizard', 'lizard', 'reptile'],
		['snake', 'Ophiuchus', 'bearer', 'serpent', 'zodiac'],
		
		//-------------
		
		['dragon face', 'dragon', 'face', 'fairy tale'],
		['dragon', 'fairy tale'],
		['sauropod', 'brachiosaurus', 'brontosaurus', 'diplodocus', 'dinosaur'],
		['T-Rex', 't-rex', 'tyrannosaurus rex', 'Tyrannosaurus Rex', 'dinosaur'],
		['spouting whale', 'face', 'spouting', 'whale'],
		['whale'],
		['dolphin', 'flipper'],
		['fish', 'Pisces', 'zodiac', 'Wanda'],
		['tropical fish', 'fish', 'tropical'],
		['blowfish', 'fish'],
		
		//-------------
		
		['shark', 'fish', 'shark'],
		['octopus'],
		['spiral shell', 'shell', 'spiral'],
		['crab', 'Cancer', 'zodiac'],
		['shrimp', 'food', 'shellfish', 'shrimp', 'small'],
		['squid', 'food', 'molusc', 'squid'],
		['snail'],
		['butterfly', 'insect', 'pretty'],
		['bug', 'insect'],
		['ant', 'insect'],
		
		//-------------
		
		['honeybee', 'bee', 'insect'],
		['lady beetle', 'beetle', 'insect', 'ladybird', 'ladybug'],
		['cricket', 'insect'],
		['spider', 'arachnid'],
		['spider web', 'spider', 'web'],
		['scorpion', 'Scorpius', 'scorpio', 'zodiac'],
	//nature
		['bouquet', 'flower'],
		['cherry blossom', 'blossom', 'cherry', 'flower'],
		['white flower', 'flower'],
		['rosette', 'plant', 'flower'],
		
		//-------------
		
		['rose', 'flower'],
		['wilted flower', 'flower', 'wilted'],
		['hibiscus', 'flower'],
		['sunflower', 'flower', 'sun'],
		['blossom', 'flower'],
		['tulip', 'flower'],
		['seedling', 'young', 'plant'],
		['evergreen tree', 'tree'],
		['deciduous tree', 'deciduous', 'shedding', 'tree'],
		['palm tree', 'palm', 'tree'],
		
		//-------------
		
		['cactus', 'plant'],
		['sheaf of rice', 'ear', 'grain', 'rice'],
		['herb', 'leaf'],
		['shamrock', 'plant', 'Ireland'],
		['four leaf clover', '4', 'clover', 'four', 'leaf'],
		['maple leaf', 'falling', 'leaf', 'maple'],
		['fallen leaf', 'falling', 'leaf', 'autumn'],
		['leaf fluttering in wind', 'blow', 'flutter', 'leaf', 'wind'], 
		
		['new moon', 'moon'],
		['waxing crescent moon', 'crescent'],
		['first quarter moon', 'moon'],
		['waxing gibbous moon', 'moon'],
		['full moon', 'moon'],
		['waning gibbous moon', 'moon'],
		['last quarter moon', 'moon'],
		['waning crescent moon', 'crescent', 'moon'],
		['crescent moon', 'crescent', 'moon'],
		['new moon face', 'moon'],
		
		//-------------
		
		['first quarter moon with face', 'face', 'moon'],
		['last quarter moon with face', 'face', 'moon'],
		['thermometer', 'heat', 'weather'],
		['sun', 'weather'],
		['full moon with face', 'face', 'moon'],
		['sun with face', 'face', 'sun'],
		['white medium star', 'star'],
		['glowing star', 'star'],
		['shooting star', 'star'],
		['cloud', 'weather'],
		
		//-------------
		
		['sun behind cloud', 'sun', 'weather'],
		['cloud with lightning and rain', 'cloud', 'rain', 'lightning', 'weather'],
		['sun behind small cloud', 'weather', 'cloud', 'sun', 'weather'],
		['sun behind large cloud', 'weather', 'cloud', 'sun', 'weather'],
		['sun behind rain cloud', 'cloud', 'sun', 'weather', 'rain'],
		['cloud with rain', 'weather', 'weather', 'cloud', 'rain'],
		['cloud with snow', 'weather', 'cloud', 'snow'],
		['cloud with lightning', 'weather', 'cloud', 'lightning'],
		['tornado', 'weather', 'wind'],
		['fog', 'weather'],
		
		//-------------
		
		['wind face', 'weather', 'wind'],
		['cyclone', 'weather', 'wind'],
		['rainbow', 'colors', 'weather'],
		['closed umbrella', 'umbrella'],
		['umbrella', 'rain', 'weather'],
		['umbrella with rain drops', 'rain', 'umbrella', 'weather'],
		['umbrella on ground', 'umbrella'],
		['high voltage', 'electricity'],
		['snowflake', 'snow', 'weather'],
		['snowman', 'snow'],
		
		//-------------
		
		['snowman without snow', 'snowman'],
		['comet', 'asteroid', 'star'],
		['fire'],
		['droplet', 'water'],
		['water wave', 'water', 'wave']
	], [ //Food and drink
		//food ?
		['grapes', 'fruit', 'grape', 'raisin'],
		['melon', 'fruit'],
		
		//-------------
		
		['watermelon', 'fruit'],
		['tangerine', 'fruit', 'orange'],
		['lemon', 'citrus', 'fruit'],
		['banana', 'fruit'],
		['pineapple', 'fruit'],
		['red apple', 'apple', 'fruit', 'red'],
		['green apple', 'apple', 'fruit', 'green'],
		['pear', 'fruit'],
		['peach', 'fruit'],
		['cherries', 'cherry', 'fruit'],
		
		//-------------
		
		['strawberry', 'berry', 'fruit'],
		['kiwi fruit', 'food', 'fruit', 'kiwi'],
		['tomato', 'fruit', 'vegetable'],
		['coconut'],
		['avocado', 'avocado', 'food', 'fruit'],
		['eggplant', 'aubergine', 'vegetable'],
		['potato', 'food', 'potato', 'vegetable'],
		['carrot', 'carrot', 'food', 'vegetable'],
		['ear of corn', 'corn', 'ear', 'maize', 'maze'],
		['hot pepper', 'hot', 'pepper'],
		
		//-------------
		
		['cucumber', 'cucumber', 'food', 'pickle', 'vegetable'],
		['broccoli', 'vegetable'],
		['mushroom', 'toadstool'],
		['peanuts', 'food', 'nut', 'peanut', 'vegetable'],
		['chestnut', 'plant'],
		['bread', 'loaf'],
		['croissant', 'bread', 'crescent roll', 'croissant', 'food', 'french'],
		['baguette bread', 'baguette', 'bread', 'food', 'french'],
		['pretzel', 'twisted', 'convoluted'],
		['pancakes', 'crêpe', 'food', 'hotcake', 'pancake'],
		
		//-------------
		
		['cheese wedge', 'cheese'],
		['meat on bone', 'bone', 'meat'],
		['poultry leg', 'bone', 'chicken', 'leg', 'poultry'],
		['cut of meat', 'chop', 'lambchop', 'porkchop', 'steak'],
		['bacon', 'bacon', 'food', 'meat'],
		['hamburger', 'burger'],
		['french fries', 'french', 'fries'],
		['pizza', 'cheese', 'slice'],
		['hot dog', 'frankfurter', 'hotdog', 'sausage'],
		['sandwich'],
		
		//-------------
		
		['taco', 'mexican'],
		['burrito', 'mexican', 'wrap'],
		['stuffed flatbread', 'falafel', 'flatbread', 'food', 'gyro', 'kebab', 'stuffed'],
		['egg', 'food'],
		['cooking', 'egg', 'frying', 'pan'],
		['shallow pan of food', 'casserole', 'food', 'paella', 'pan', 'shallow'],
		['pot of food', 'pot', 'stew'],
		['bowl with spoon', 'breakfast', 'cereal', 'congee', 'oatmeal', 'porridge'],
		['green salad', 'food', 'green', 'salad'],
		['popcorn'],
		
		//-------------
		
		['canned food', 'can'],
		['bento box', 'bento', 'box'],
		['rice cracker', 'cracker', 'rice'],
		['rice ball', 'Japanese', 'ball', 'rice'],
		['cooked rice', 'cooked', 'rice'],
		['curry rice', 'curry', 'rice'],
		['steaming bowl', 'bowl', 'noodle', 'ramen', 'steaming'],
		['spaghetti', 'pasta'],
		['roasted sweet potato', 'potato', 'roasted', 'sweet'],
		['oden', 'seafood', 'skewer', 'stick'],
		
		//-------------
		
		['sushi', 'fish'],
		['fried shrimp', 'fried', 'prawn', 'shrimp', 'tempura'],
		['fish cake with swirl', 'cake', 'fish', 'pastry', 'swirl', 'debian'],
		['dango', 'Japanese', 'dessert', 'skewer', 'stick', 'sweet'],
		['dumpling', 'empanada', 'gyōza', 'jiaozi', 'pierogi', 'potsticker'],
		['fortune cookie'],
		['takeout box', 'oyster pail'],
		['soft ice cream', 'cream', 'dessert', 'ice', 'icecream', 'soft', 'sweet'],
		['shaved ice', 'dessert', 'ice', 'shaved', 'sweet'],
		['ice cream', 'cream', 'dessert', 'ice', 'sweet'],
		
		//-------------
		
		['doughnut', 'dessert', 'donut', 'sweet'],
		['cookie', 'dessert', 'sweet'],
		['birthday cake', 'birthday', 'cake', 'celebration', 'dessert', 'pastry', 'sweet'],
		['shortcake', 'cake', 'dessert', 'pastry', 'slice', 'sweet'],
		['pie', 'fruit', 'meat'],
		['chocolate bar', 'bar', 'chocolate', 'dessert', 'sweet'],
		['candy', 'sweet'],
		['lollipop', 'sweet'],
		['custard', 'dessert'],
		['honey pot', 'sugar', 'bee'],
		
		//-------------
		
		['baby bottle', 'milk', 'baby', 'drink'],
		['glass of milk', 'milk', 'glass', 'drink'],
		['hot beverage', 'coffee', 'tea', 'soup', 'cup'],
		['teacup without handle', 'tea', 'bowl', 'cup'],
		['sake', 'alcohol', 'Japan'],
		['bottle with popping cork', 'Champagne', 'alcohol', 'party'],
		['wine glass', 'wine', 'drink', 'alcohol'],
		['cocktail glass', 'alcohol', 'party'],
		['tropical drink', 'fruits', 'party'],
		['beer mug', 'beer', 'alcohol'],
		
		//-------------
		
		['clinking beer mugs', 'party', 'beer mug', 'beer', 'alcohol'],
		['clinking glasses', 'party', 'glass'],
		['tumbler glass', 'glass'],
		['cup with straw', 'cup', 'straw'],
		['chopsticks'],
		['fork and knife with plate', 'flatware', 'fork', 'knife', 'plate'],
		['fork and knife', 'fork', 'knife', 'cutlery'],
		['spoon', 'cutlery'],
		['kitchen knife', 'knife', 'cutlery'],
		['amphora']
	], [//Travels and places
	//--------maps
		['globe showing Europe-Africa', 'globe', 'Europe', 'Africa'],
		['globe showing Americas', 'globe', 'America'],
		['globe showing Asia-Australia', 'globe', 'Asia', 'Australia'],
		['globe with meridians', 'globe', 'meridians'],
		['world map', 'map', 'world'],
		['map of Japan', 'Japan', 'map'],
	//----geographic
		['snow-capped mountain', 'mountain', 'snow'],
		['mountain', 'snow'],
		['volcano', 'mountain', 'lava'],
		['mount Fuji', 'volcano', 'Fujisan', 'mountain', 'snow'],
		
		//-------------
	
		['camping', 'tent', 'pavilion'],
		['beach with umbrella', 'beach', 'umbrella', 'sand'],
		['desert', 'sand', 'cactus'],
		['desert island', 'sand', 'island', 'desert'],
		['national park', 'nature', 'park'],
	//-----place-building
		['stadium', 'building', 'place'],
		['classical building', 'Antiquity', 'building', 'place'],
		['building construction', 'crane', 'construction', 'building'],
		['houses', 'building', 'place'],
		['cityscape', 'skyscraper', 'city', 'building', 'place'],
		
		//-------------
		
		['derelict house', 'abandoned', 'ruin', 'building'],
		['house', 'building'],
		['house with garden', 'house', 'garden', 'building'],
		['office building', 'office', 'building', 'place'],
		['Japanese post office', 'post office', 'Japan'],
		['post office', 'office', 'building', 'place'],
		['hospital', 'doctor', 'building', 'place'],
		['bank', 'office', 'money', 'building', 'place'],
		['hotel'],
		['love hotel', 'hotel', 'love'],
		
		//-------------
		
		['convenience store', 'konbini', 'store', 'grocery'],
		['school', 'academy', 'building', 'place'],
		['department store', 'store'],
		['factory', 'work', 'manufactory'],
		['Japanese castle', 'Japan', 'castle'],
	//------
		['castle', 'medieval', 'tale'],
		['wedding', 'love'],
		['Tokyo tower', 'Tokyo', 'tower'],
		['Statue of Liberty', 'New York', 'liberty', 'USA'],
		['church', 'Christ', 'religion', 'christianism'],
		
		//-------------
		
		['mosque', 'religion', 'islam', 'muslim'],
		['synagogue', 'religion', 'judaism'],
		['shinto shrine', 'religion', 'Japan', 'kami'],
		['kaaba', 'religion', 'Mecca', 'islam', 'muslim'],
	//place-other
		['fountain', 'water'],
		['tent', 'camping', 'pavilion'],
		['foggy', 'fog', 'weather'],
		['night with stars', 'night', 'stars'],
		['sunrise over mountains', 'sunrise', 'mountains'],
		['sunrise', 'sun'],
		
		//-------------
		
		['cityscape at dusk', 'skyscraper', 'city'],
		['sunset', 'sun'],
		['bridge at night', 'bridge', 'night'],
		['hot springs', 'baths', 'Japan'],
		['milky way', 'stars', 'space'],
		['carousel horse', 'amusement park'],
		['ferris wheel', 'amusement park'],
		['roller coaster', 'amusement park'],
		['barber pole', 'barber'],
		['circus tent', 'circus', 'show'],
		
		//-------------
		
		['performing arts', 'arts', 'theater'],
		['framed picture', 'picture', 'painting'],
		['artist palette', 'painting'],
		['slot machine', 'game', 'casino'],
	//transport-ground
		['locomotive', 'transport', 'train'],
		['railway car', 'transport', 'train'],
		['high-speed train', 'transport', 'train'],
		['high-speed train with bullet nose', 'transport', 'train'],
		['train', 'transport', 'vehicle'],
		['metro', 'transport', 'vehicle'],
		
		//-------------
		
		['light rail', 'transport', 'train'],
		['station', 'transport', 'train'],
		['tram', 'transport', 'vehicle'],
		['monorail', 'transport', 'train'],
		['mountain railway', 'transport', 'train', 'mountain'],
		['tram car', 'transport', 'tram'],
		['bus', 'transport', 'vehicle'],
		['oncoming bus', 'transport', 'bus'],
		['trolleybus', 'transport'],
		['minibus', 'transport', 'vehicle'],
		
		//-------------
		
		['ambulance', 'car', 'hospital', 'vehicle'],
		['fire engine', 'fire', 'firemen', 'vehicle'],
		['police car', 'car', 'police', 'vehicle'],
		['oncoming police car', 'police'],
		['taxi', 'car', 'vehicle'],
		['oncoming taxi', 'car'],
		['automobile', 'car', 'vehicle'],
		['oncoming automobile', 'automobile', 'car'],
		['sport utility vehicle', 'automobile', 'utility', 'car'],
		['delivery truck', 'truck', 'vehicle'],
		
		//-------------
		
		['articulated lorry', 'truck', 'vehicle'],
		['tractor', 'vehicle'],
		['bicycle', 'bike', 'vehicle'],
		['kick scooter', 'scooter'],
		['motor scooter', 'scooter', 'motorbike'],
		['bus stop', 'bus'],
		['motorway', 'road'],
		['railway track', 'rails', 'train'],
		['fuel pump', 'fuel'],
		['police car light', 'police'],
		
		//-------------
		
		['horizontal traffic light', 'traffic light', 'horizontal', 'road sign'],
		['vertical traffic light', 'traffic light', 'vertical', 'road sign'],
		['construction', 'road sign'],
		['stop sign', 'road sign', 'stop'],
	//transport-water
		['anchor', 'boat', 'sea'],
		['sailboat', 'boat', 'sea'],
		['canoe', 'boat'],
		['speedboat', 'boat'],
		['passenger ship', 'boat', 'ship'],
		['ferry', 'boat', 'ship'],
		
		//-------------
		
		['motor boat', 'boat'],
		['ship', 'boat'],
	//transport-air
		['airplane', 'plane', 'fly'],
		['small airplane', 'plane', 'airplane', 'fly'],
		['airplane departure', 'plane', 'airplane', 'take-off'],
		['airplane arrival', 'plane', 'airplane', 'landing'],
		['seat', 'plane'],
		['helicopter', 'fly'],
		['suspension railway', 'railway'],
		['mountain cableway', 'mountain'],
		
		//-------------
		
		['aerial tramway', 'mountain'],
		['satellite', 'space'],
		['rocket', 'spaceship'],
		['flying saucer', 'E.T.', 'area 51', 'alien'],
	//hotel
		['bellhop bell', 'bell'],
		['door'],
		['bed', 'sleeping'],
		['couch and lamp'],
		['toilet', 'WC'],
		['shower', 'bathroom'],
		//-------------
		['bathtub', 'bathroom']
	], [
	//Activities and sports
		['jack-o-lantern', 'Halloween'],
		['Christmas tree', 'tree', 'Christmas', 'fir'],
		['fireworks', 'party'],
		['sparkler', 'party'],
		['sparkles', 'party'],
		
		//-------------
		
		['balloon', 'party'],
		['party popper', 'party'],
		['confetti ball', 'party'],
		['tanabata tree', 'bamboo'],
		['pine decoration'],
		['Japanese dolls', 'dolls', 'Japan'],
		['carp streamer', 'carp', 'Japan'],
		['wind chime', 'wind', 'Japan'],
		['moon viewing ceremony', 'moon', 'Japan'],
		['ribbon'],
		
		//-------------
		
		['wrapped gift', 'gift'],
		['reminder ribbon', 'ribbon'],
		['admission tickets', 'ticket'],
		['ticket'],
		['military medal', 'medal'],
		['trophy', 'cup'],
		['sports medal', 'medal'],
		['1st place medal', 'medal', 'gold'],
		['2nd place medal', 'medal', 'silver'],
		['3rd place medal', 'medal', 'bronze'],
		
		//-------------
	
	//sport
		['soccer ball', 'soccer', 'ball'],
		['baseball', 'ball'],
		['basketball', 'ball'],
		['volleyball', 'ball'],
		['american football', 'ball'],
		['rugby football', 'ball', 'rugby'],
		['tennis', 'ball'],
		['pool 8 ball', 'ball'],
		['bowling'],
		['cricket game', 'cricket'],
		
		//-------------
		
		['field hockey', 'hockey'],
		['ice hockey', 'hockey'],
		['ping pong', 'table tennis'],
		['badminton'],
		['boxing glove', 'boxing', 'glove'],
		['martial arts uniform', 'martial arts', 'kimono'],
		['goal net'],
		['direct hit', 'target'],
		['flag in hole', 'golf'],
		['ice skate', 'ice'],
		
		//-------------
		
		['fishing pole', 'fishing'],
		['running shirt', 'shirt'],
		['skis', 'skiing'],
		['sled', 'snow'],
		['curling stone', 'curling'],
	//game
		['video game', 'game', 'gaming'],
		['joystick', 'video game', 'game', 'gaming'],
		['game die', 'game', 'dice'],
		['spade suit', 'game', 'spade', 'playing cards'],
		['heart suit', 'game', 'heart', 'playing cards'],
		
		//-------------
		
		['diamond suit', 'game', 'diamond', 'playing cards'],
		['club suit', 'game', 'club', 'playing cards'],
		['joker', 'game', 'playing cards'],
		['mahjong red dragon', 'game', 'mahjong'],
		['flower playing cards', 'game'],
	//music
		['musical score'],
		['studio microphone'],
		['level slider'],
		['control knobs'],
		
		//-------------
		
		['microphone'],
		['headphone'],
		['radio'],
		['saxophone'],
		['guitar'],
		['musical keyboard'],
		['trumpet'],
		['violin'],
		['drum'],
		
		['postal horn'],
		
	//-----person-sport
		['person fencing', 'fencer', 'fencing', 'sword'],
		['horse racing', 'horse', 'jockey', 'racehorse', 'racing'],
		['skier', 'ski', 'snow'],
		['snowboarder', 'ski', 'snow', 'snowboard'],
		['person golfing', 'ball', 'golf'],
		['person surfing', 'surfing'],
		['person rowing boat', 'boat', 'rowboat'],
		//-------------
		['person swimming', 'swim'],
		['person bouncing ball', 'ball'],
		['person lifting weights', 'lifter', 'weight'],
		['person biking', 'bicycle', 'biking', 'cyclist'],
		['person mountain biking', 'bicycle', 'bicyclist', 'bike', 'cyclist', 'mountain'],
		['racing car', 'car', 'racing'],
		['motorcycle', 'racing'],
		['person cartwheeling', 'cartwheel', 'gymnastics'],
		['people wrestling', 'wrestle', 'wrestler'],
		['person playing water polo', 'polo', 'water'],
		//-------------
		['person playing handball', 'ball', 'handball'],
		['person juggling', 'balance', 'juggle', 'multitask', 'skill']
	], [
	
	//Objects
		
	//phone
		['mobile phone'],
		
		//-------------
		
		['mobile phone with arrow'],
		['telephone'],
		['telephone receiver'],
		['pager'],
		['fax machine'],
		['battery'],
		['electric plug'],
		['laptop computer'],
		['desktop computer'],
		['printer'],
		
		//-------------
		
		['keyboard'],
		['computer mouse'],
		['trackball'],
		['computer disk'],
		['floppy disk'],
		['optical disk'],
		['dvd'],
		['movie camera'],
		['film frames'],
		['film projector'],
		
		//-------------
		
		['clapper board'],
		['television'],
		['camera'],
		['camera with flash'],
		['video camera'],
		['videocassette'],
		['left-pointing magnifying glass'],
		['right-pointing magnifying glass'],
		['microscope'],
		['telescope'],
		
		//-------------
		
		['satellite antenna'],
		['candle'],
		['light bulb'],
		['flashlight'],
		['red paper lantern'],
		
		
	//time
		
		['hourglass', 'time'],
		['hourglass with flowing sand', 'sand', 'time'],
		['watch', 'clock', 'time'],
		['alarm clock', 'clock', 'time'],
		['stopwatch', 'watch', 'clock', 'time'],
		['timer clock', 'clock', 'time'],
		['mantelpiece clock', 'clock', 'time'],
		
	//
		
		['notebook with decorative cover'],
		['closed book'],
		['open book'],
		['green book'],
		['blue book'],
		
		//-------------
		
		['orange book'],
		['books'],
		['notebook'],
		['ledger'],
		['page with curl'],
		['scroll'],
		['page facing up'],
		['newspaper'],
		['rolled-up newspaper'],
		['bookmark tabs'],
		
		//-------------
		
		['bookmark'],
		['label'],
		['money bag'],
		['yen banknote'],
		['dollar banknote'],
		['euro banknote'],
		['pound banknote'],
		['money with wings'],
		['credit card'],
		['chart increasing with yen'],
		
		//-------------
		
		['currency exchange'],
		['heavy dollar sign'],
	//mail
		['envelope'],
		['e-mail'],
		['incoming envelope'],
		['envelope with arrow'],
		['outbox tray'],
		['inbox tray'],
		['package'],
		['closed mailbox with raised flag'],
		
		//-------------
		
		['closed mailbox with lowered flag'],
		['open mailbox with raised flag'],
		['open mailbox with lowered flag'],
		['postbox'],
		['ballot box with ballot'],
		['pencil'],
		['black nib'],
		['fountain pen'],
		['pen'],
		['paintbrush'],
		
		//-------------
		
		['crayon'],
		['memo'],
		['briefcase'],
		['file folder'],
		['open file folder'],
		['card index dividers'],
		['calendar'],
		['tear-off calendar'],
		['spiral notepad'],
		['spiral calendar'],
		
		//-------------
		
		['card index'],
		['chart increasing'],
		['chart decreasing'],
		['bar chart'],
		['clipboard'],
		['pushpin'],
		['round pushpin'],
		['paperclip'],
		['linked paperclips'],
		['straight ruler'],
		
		//-------------
		
		['triangular ruler'],
		['scissors'],
		['card file box'],
		['file cabinet'],
		['wastebasket'],
	//lock
		['locked'],
		['unlocked'],
		['locked with pen'],
		['locked with key'],
		['key'],
		
		//-------------
		
		['old key'],
	//tool
		['hammer'],
		['pick'],
		['hammer and pick'],
		['hammer and wrench'],
		['dagger'],
		['crossed swords'],
		['pistol'],
		['bow and arrow'],
		['shield'],
		
		//-------------
		
		['wrench'],
		['nut and bolt'],
		['gear'],
		['clamp'],
		['alembic'],
		['balance scale'],
		['link'],
		['chains'],
	//other
		['syringe'],
		['pill'],
		
		//-------------
		
		['cigarette'],
		['coffin'],
		['funeral urn'],
		['moai'],
		['oil drum'],
		['crystal ball'],
		['shopping cart']
	], [
	//Symbols
	
	//emotion
		['kiss mark', 'kiss', 'lips'],
		['heart with arrow', 'arrow', 'cupid'],
		['red heart', 'red', 'heart'],
		//-------------
		['beating heart', 'beating', 'heartbeat', 'pulsating'],
		['broken heart', 'heart', 'break', 'broken'],
		['two hearts', 'heart', 'love'],
		['sparkling heart', 'heart', 'excited', 'sparkle'],
		['growing heart', 'heart', 'excited', 'growing', 'nervous', 'pulse'],
		['blue heart', 'blue', 'heart'],
		['green heart', 'green', 'heart'],
		['yellow heart', 'yellow', 'heart'],
		['purple heart', 'purple', 'heart'],
		['black heart', 'heart', 'black', 'evil', 'wicked'],
		//-------------
		['heart with ribbon', 'ribbon', 'valentine'],
		['revolving hearts', 'revolving', 'heart'],
		['heart decoration', 'heart'],
		['heavy heart exclamation', 'heart', 'exclamation', 'mark', 'punctuation'],
		['love letter', 'heart', 'letter', 'love', 'mail'],
		['zzz', 'comic', 'sleep'],
		['anger symbol', 'angry', 'comic', 'mad'],
		['bomb', 'comic'],
		['collision', 'boom', 'comic'],
		['sweat droplets', 'comic', 'splashing', 'sweat'],
		//-------------
		['dashing away', 'comic', 'dash', 'running'],
		['dizzy', 'comic', 'star'],
		['speech balloon', 'balloon', 'bubble', 'comic', 'dialog', 'speech'],
		['left speech bubble', 'dialog', 'speech'],
		['right anger bubble', 'angry', 'balloon', 'bubble', 'mad'],
		['thought balloon', 'balloon', 'bubble', 'comic', 'thought'],
		['hole'],
	//music and sound
		['musical note'],
		['musical notes'],
	
		['muted speaker'],
		['speaker low volume'],
		['speaker medium volume'],
		['speaker high volume'],
		['loudspeaker'],
		
		//-------------
		
		['megaphone'],
		['bell'],
		['bell with slash'],
		
	//transport-sign
		['ATM sign'],
		['litter in bin sign'],
		['potable water'],
		
		//-------------
		
		['wheelchair symbol'],
		['men’s room'],
		['women’s room'],
		['restroom'],
		['baby symbol'],
		['water closet'],
		['passport control'],
		['customs'],
		['baggage claim'],
		['left luggage'],
		
		//-------------
	//warning
		['warning'],
		['children crossing'],
		['no entry'],
		['prohibited'],
		['no bicycles'],
		['no smoking'],
		['no littering'],
		['non-potable water'],
		['no pedestrians'],
		['no mobile phones'],
		
		//-------------
		
		['no one under eighteen'],
		['radioactive'],
		['biohazard'],
	//arrow
		['up arrow'],
		['up-right arrow'],
		['right arrow'],
		['down-right arrow'],
		['down arrow'],
		['down-left arrow'],
		['left arrow'],
		
		//-------------
		
		['up-left arrow'],
		['up-down arrow'],
		['left-right arrow'],
		['right arrow curving left'],
		['left arrow curving right'],
		['right arrow curving up'],
		['right arrow curving down'],
		['clockwise vertical arrows'],
		['counterclockwise arrows button'],
		['BACK arrow'],
		
		//-------------
		
		['END arrow'],
		['ON! arrow'],
		['SOON arrow'],
		['TOP arrow'],
		['place of worship'],
		['atom symbol'],
		['om'],
		['star of David'],
		['wheel of dharma'],
		['yin yang'],
		
		//-------------
		
		['latin cross'],
		['orthodox cross'],
		['star and crescent'],
		['peace symbol'],
		['menorah'],
		['dotted six-pointed star'],
		['Aries'],
		['Taurus'],
		['Gemini'],
		['Cancer'],
		
		//-------------
		
		['Leo'],
		['Virgo'],
		['Libra'],
		['Scorpius'],
		['Sagittarius'],
		['Capricorn'],
		['Aquarius'],
		['Pisces'],
		['Ophiuchus'],
		['shuffle tracks button'],
		
		//-------------
		
		['repeat button'],
		['repeat single button'],
		['play button'],
		['fast-forward button'],
		['next track button'],
		['play or pause button'],
		['reverse button'],
		['fast reverse button'],
		['last track button'],
		['up button'],
		
		//-------------
		
		['fast up button'],
		['down button'],
		['fast down button'],
		['pause button'],
		['stop button'],
		['record button'],
		['eject button'],
		['cinema'],
		['dim button'],
		['bright button'],
		
		//-------------
		
		['antenna bars'],
		['vibration mode'],
		['mobile phone off'],
	//other-symbol
		['female sign'],
		['male sign'],
		['medical symbol'],
		['recycling symbol'],
		['fleur-de-lis'],
		['trident emblem'],
		['name badge'],
		
		//-------------
		
		['Japanese symbol for beginner'],
		['heavy large circle'],
		['white heavy check mark'],
		['ballot box with check'],
		['heavy check mark'],
		['heavy multiplication x'],
		['cross mark'],
		['cross mark button'],
		['heavy plus sign'],
		['heavy minus sign'],
		
		//-------------
		
		['heavy division sign'],
		['curly loop'],
		['double curly loop'],
		['part alternation mark'],
		['eight-spoked asterisk'],
		['eight-pointed star'],
		['sparkle'],
		['double exclamation mark'],
		['exclamation question mark'],
		['question mark'],
		
		//-------------
		
		['white question mark'],
		['white exclamation mark'],
		['exclamation mark'],
		['wavy dash'],
		['copyright'],
		['registered'],
		['trade mark'],
	//keycap
	/*	['#', 'keycap'],
		['*', 'keycap'],
		['0', 'keycap'],
		
		//-------------
		
		['1', 'keycap'],
		['2', 'keycap'],
		['3', 'keycap'],
		['4', 'keycap'],
		['5', 'keycap'],
		['6', 'keycap'],
		['7', 'keycap'],
		['8', 'keycap'],
		['9', 'keycap'],
		['10', 'keycap'],
	*/	
		//-------------
		
		['hundred points'],
		['input latin uppercase'],
		['input latin lowercase'],
		['input numbers'],
		['input symbols'],
		['input latin letters'],
		['A button (blood type)'],
		['AB button (blood type)'],
		['B button (blood type)'],
		['CL button'],
		
		//-------------
		
		['COOL button'],
		['FREE button'],
		['information'],
		['ID button'],
		['circled M'],
		['NEW button'],
		['NG button'],
		['O button (blood type)'],
		['OK button'],
		['P button'],
		
		//-------------
		
		['SOS button'],
		['UP! button'],
		['VS button'],
		['Japanese “here” button'],
		['Japanese “service charge” button'],
		['Japanese “monthly amount” button'],
		['Japanese “not free of charge” button'],
		['Japanese “reserved” button'],
		['Japanese “bargain” button'],
		['Japanese “discount” button'],
		
		//-------------
		
		['Japanese “free of charge” button'],
		['Japanese “prohibited” button'],
		['Japanese “acceptable” button'],
		['Japanese “application” button'],
		['Japanese “passing grade” button'],
		['Japanese “vacancy” button'],
		['Japanese “congratulations” button'],
		['Japanese “secret” button'],
		['Japanese “open for business” button'],
		['Japanese “no vacancy” button'],
		
		//-------------
	//geometric
		['black small square'],
		['white small square'],
		['white medium square'],
		['black medium square'],
		['white medium-small square'],
		['black medium-small square'],
		['black large square'],
		['white large square'],
		['large orange diamond'],
		['large blue diamond'],
		
		//-------------
		
		['small orange diamond'],
		['small blue diamond'],
		['red triangle pointed up'],
		['red triangle pointed down'],
		['diamond with a dot'],
		['radio button'],
		['black square button'],
		['white square button'],
		['white circle'],
		['black circle'],
		['red circle'],
		['blue circle'],

	//time
			
		['hour', '12h00', '0h00'],
		['hour', '12h30', '0h30'],
		//-------------
		['hour', '13h00', '1h00'],
		['hour', '13h30', '1h30'],
		['hour', '14h00', '2h00'],
		['hour', '14h30', '2h30'],
		['hour', '15h00', '3h00'],
		['hour', '15h30', '3h30'],
		['hour', '16h00', '4h00'],
		['hour', '16h30', '4h30'],
		['hour', '17h00', '5h00'],
		['hour', '17h30', '5h30'],	
		//-------------	
		['hour', '18h00', '6h00'],
		['hour', '18h30', '6h30'],
		['hour', '19h00', '7h00'],
		['hour', '19h30', '7h30'],
		['hour', '20h00', '8h00'],
		['hour', '20h30', '8h30'],
		['hour', '21h00', '9h00'],
		['hour', '21h30', '9h30'],
		['hour', '22h00', '10h00'],
		['hour', '22h30', '10h30'],
		['hour', '23h00', '11h00'],
		['hour', '23h30', '11h30']
		
	], [
		
	//Flags
		
		['chequered flag', 'flag'],
		['triangular flag'],
		['crossed flags'],
		['black flag'],
		['white flag', 'flag'],
		//['rainbow flag', 'lgbt', 'LGBT'],
		
		//-------------
		
		['Ascension Island'],
		['Andorra'],
		['United Arab Emirates'],
		['Afghanistan'],
		['Antigua & Barbuda'],
		['Anguilla'],
		['Albania'],
		['Armenia'],
		['Angola'],
		['Antarctica'],
		['Argentina'],
		['American Samoa'],
		['Austria'],
		['Australia'],
		['Aruba'],
		['Åland Islands', 'Aaland Islands'],
		['Azerbaijan'],
		['Bosnia & Herzegovina', 'Herzegovina'],
		['Barbados'],
		['Bangladesh'],
		['Belgium'],
		['Burkina Faso'],
		['Bulgaria'],
		['Bahrain'],
		['Burundi'],
		['Benin'],
		['St. Barthélemy', 'Barthélemy', 'Saint Barthélemy'],
		['Bermuda'],
		['Brunei'],
		['Brunei'],
		['Caribbean Netherlands'],
		['Brazil'],
		['Bahamas'],
		['Bhutan'],
		['Bouvet Island'],
		['Botswana'],
		['Belarus'],
		['Belize'],
		['Canada'],
		['Cocos Islands', 'Keeling Islands'],
		['Congo', 'Kinshasa'],
		['Central African Republic'],
		['Congo', 'Brazzaville'],
		['Switzerland', 'Helvetic Confederation'],
		['Côte d’Ivoire'],
		['Cook Islands'],
		['Chile'],
		['Cameroon'],
		['China'],
		['Colombia'],
		['Clipperton Island'],
		['Costa Rica'],
		['Cuba'],
		['Cape Verde'],
		['Curaçao'],
		['Christmas Island'],
		['Cyprus'],
		['Czechia'],
		['Germany'],
		['Diego Garcia'],
		['Djibouti'],
		['Denmark'],
		['Dominica'],
		['Dominican Republic'],
		['Algeria'],
		['Ceuta & Melilla'],
		['Ecuador'],
		['Estonia'],
		['Egypt'],
		['Western Sahara', 'Sahrawi Republic'],
		['Eritrea'],
		['Spain'],
		['Ethiopia'],
		['European Union', 'Europe'],
		['Finland'],
		['Fiji'],
		['Falkland Islands'],
		['Micronesia'],
		['Faroe Islands'],
		['France', 'baguette'],
		['Gabon'],
		['United Kingdom', 'Great Britain'],
		['Grenada'],
		['Georgia'],
		['French Guiana'],
		['Guernsey'],
		['Ghana'],
		['Gibraltar'],
		['Greenland'],
		['Gambia'],
		['Guinea'],
		['Guadeloupe'],
		['Equatorial Guinea'],
		['Greece'],
		['South Georgia', 'South Sandwich Islands', 'South Georgia & South Sandwich Islands'],
		['Guatemala'],
		['Guam'],
		['Guinea-Bissau'],
		['Guyana'],
		['Hong Kong'],
		['Heard & McDonald Islands', 'Heard & McDonald'],
		['Honduras'],
		['Croatia'],
		['Haiti'],
		['Hungary'],
		['Canary Islands'],
		['Indonesia'],
		['Ireland'],
		['Israel', 'Palestine'],
		['Isle of Man', 'Man'],
		['India'],
		['British Indian Ocean Territory', 'Indian Ocean'],
		['Iraq'],
		['Iran', 'Persia'],
		['Iceland'],
		['Italy'],
		['Jersey'],
		['Jamaica'],
		['Jordan'],
		['Japan'],
		['Kenya'],
		['Kyrgyzstan'],
		['Cambodia'],
		['Kiribati'],
		['Comoros'],
		['St. Kitts & Nevis', 'Kitts', 'Nevis'],
		['North Korea', 'Korea'],
		['South Korea', 'Korea'],
		['Kuwait'],
		['Cayman Islands', 'Cayman'],
		['Kazakhstan'],
		['Laos'],
		['Lebanon'],
		['St. Lucia', 'Lucia'],
		['Liechtenstein'],
		['Sri Lanka'],
		['Liberia'],
		['Lesotho'],
		['Lithuania'],
		['Luxembourg'],
		['Latvia'],
		['Libya'],
		['Morocco'],
		['Monaco'],
		['Moldova'],
		['Montenegro'],
		['St. Martin', 'Martin'],
		['Madagascar'],
		['Marshall Islands', 'Marshall'],
		['Macedonia'],
		['Mali'],
		['Myanmar ', 'Burma'],
		['Mongolia'],
		['Macau'],
		['Northern Mariana Islands', 'Mariana'],
		['Martinique'],
		['Mauritania'],
		['Montserrat'],
		['Malta'],
		['Mauritius'],
		['Maldives'],
		['Malawi'],
		['Mexico'],
		['Malaysia'],
		['Mozambique'],
		['Namibia'],
		['New Caledonia', 'Kanaky'],
		['Niger'],
		['Norfolk Island'],
		['Nigeria'],
		['Nicaragua'],
		['Netherlands', 'Holland'],
		['Norway'],
		['Nepal'],
		['Nauru'],
		['Niue'],
		['New Zealand'],
		['Oman'],
		['Panama'],
		['Peru'],
		['French Polynesia', 'Polynesia'],
		['Papua New Guinea', 'Guinea'],
		['Philippines'],
		['Pakistan'],
		['Poland'],
		['St. Pierre & Miquelon', 'Saint Pierre', 'Miquelon'],
		['Pitcairn Islands', 'Pitcairn'],
		['Puerto Rico'],
		['Palestine', 'Palestinian Territories'],
		['Portugal'],
		['Palau'],
		['Paraguay'],
		['Qatar'],
		['Réunion'],
		['Romania'],
		['Serbia'],
		['Russia'],
		['Rwanda'],
		['Saudi Arabia', 'Arabia'],
		['Solomon Islands', 'Solomon'],
		['Seychelles'],
		['Sudan'],
		['Sweden'],
		['Singapore'],
		['St. Helena', 'Helena'],
		['Slovenia'],
		['Svalbard & Jan Mayen', 'Svalbard'],
		['Slovakia'],
		['Sierra Leone'],
		['San Marino'],
		['Senegal'],
		['Somalia'],
		['Suriname'],
		['South Sudan', 'Sudan'],
		['São Tomé & Príncipe'],
		['El Salvador'],
		['Sint Maarten'],
		['Syria'],
		['Swaziland'],
		['Tristan da Cunha'],
		['Turks & Caicos Islands', 'Turks', 'Caicos'],
		
		['Chad'],
		['French Southern Territories'],
		['Togo'],
		['Thailand'],
		['Tajikistan'],
		['Tokelau'],
		['Timor-Leste', 'Timor', 'East Timor'],
		['Turkmenistan'],
		['Tunisia'],
		['Tonga'],
		['Turkey'],
		['Trinidad & Tobago', 'Tobago'],
		['Tuvalu'],
		['Taiwan'],
		['Tanzania'],
		['Ukraine'],
		['Uganda'],
		['U.S. Outlying Islands'],
		//['United Nations', 'UN'],
		['United States', 'USA'],
		['Uruguay'],
		['Uzbekistan'],
		['Vatican City', 'Vatican'],
		['St. Vincent & Grenadines'],
		['Venezuela'],
		['British Virgin Islands', 'Virgin'],
		['U.S. Virgin Islands', 'Virgin'],
		['Vietnam'],
		['Vanuatu'],
		['Wallis & Futuna', 'Wallis', 'Futuna'],
		['Samoa'],
		['Kosovo'],
		['Yemen'],
		['Mayotte'],
		['South Africa', 'Africa'],
		['Zambia'],
		['Zimbabwe'],
		//['England'],
		//['Scotland'],
		//['Wales']
		
	]	
];	
	

