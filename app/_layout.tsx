import {Platform, Pressable, Text, View} from "react-native";
import {useState} from "react";
import * as MediaLibrary from "expo-media-library";
import {ResizeMode, Video} from "expo-av";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function RootLayout() {

    const [displayVideoURI, setDisplayVideoURI] = useState<string>("")

    async function loadVideo() {
        const {status} = await MediaLibrary.requestPermissionsAsync();

        if (status != 'granted') {
            return
        }

        const data = await MediaLibrary.getAssetsAsync({
            first: 1,
            sortBy: MediaLibrary.SortBy.creationTime,
            album: await MediaLibrary.getAlbumAsync(Platform.OS == "ios" ? "All Photos" : "All"),
            mediaType: ["video"],
        });

        MediaLibrary.getAssetInfoAsync(data.assets[0].id).then((infos) => {
            setDisplayVideoURI(infos.localUri!)
        })

    }

    const STATUS_BAR_HEIGHT: number = useSafeAreaInsets().top

    return (
        <View style={{
            paddingTop: STATUS_BAR_HEIGHT,
        }}>
            <Pressable style={{
                padding: 5
            }} onPress={() => loadVideo()}>
                <Text>Load video</Text>
            </Pressable>
            {
                displayVideoURI != "" && <Video
                    source={{
                        uri: displayVideoURI
                    }}
                    useNativeControls={true}
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                    }}
                    shouldPlay={true}
                    isLooping={true}
                    resizeMode={ResizeMode.COVER}
                    onError={(e) => {
                        console.log(e)
                    }}
                />
            }
        </View>
    );
}
