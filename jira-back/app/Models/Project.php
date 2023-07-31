<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "code"
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function states(){
        return $this->hasMany(State::class);
    }
    //function that return the projects inside the epics, with the stories inside and the tasks inside the stories
    public function epics(){
        return $this->hasMany(Epic::class);
    }
    public function stories(){
        return $this->hasMany(Story::class)->with('tasks');
    }
    public function sprints(){
        return $this->hasMany(Sprint::class);
    }


}
