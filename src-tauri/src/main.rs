// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{remove_file, OpenOptions};
use std::io::Write;

/*
    code,
    time after videos,
    flashes: [
        1: {time, true/false}, 2: {time, true/false} ... 10: { ... }
    ],
    time after flashes
*/

#[derive(serde::Deserialize)]
struct Flash{
    time: u128,
    right: bool
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn store(
    code: Option<String>, time_after_videos: Option<u128>, flashes: Option<Vec<Flash>>, time_after_flashes: Option<u128>
){
    let mut filp = OpenOptions::new()
        .create(true)
        .append(true)
        .open("study_data.json")
        .expect("Failed to open file");
    
    if let Some(code) = code{
        writeln!(filp, "{{\n\t\"code\": \"{}\",", code).expect("Failed to write code");
    }
    else if let Some(tav) = time_after_videos{
        writeln!(filp, "\t\"time_after_videos\": {},", tav).expect("Failed to write time_after_videos");
    }
    else if let Some(flashes) = flashes{
        writeln!(filp, "\t\"flashes\": [").expect("Failed to write flashes start");
        flashes.iter().enumerate().for_each(|(n, flash)|{
            // If it's not the last flash
            if n != flashes.len() - 1{
                writeln!(filp, "\t\t{{\"time\": {}, \"right\": {}}},", flash.time, flash.right).expect("failed to write a flash");
            }
            else{
                writeln!(filp, "\t\t{{\"time\": {}, \"right\": {}}}", flash.time, flash.right).expect("failed to write a flash");
            }
        });
        
        writeln!(filp, "\t],").expect("Failed to write flashes end");
    }
    if let Some(taf) = time_after_flashes{
        writeln!(filp, "\t\"time_after_flashes\": {}\n}}", taf).expect("Failed writing time_after_flashes");
    }
}

#[tauri::command]
fn del_record(){
    remove_file("study_data.json").expect("Failed to delete data file")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![store, del_record])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
